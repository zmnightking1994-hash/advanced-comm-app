"use client";

import { useState, useEffect, useRef } from "react";

// تعريف أنواع الغرف
type RoomType = "focus" | "story" | "center" | "general";

export default function Home() {
  const [activeRoom, setActiveRoom] = useState<RoomType>("general");
  const [input, setInput] = useState("");
  
  // تخزين الرسائل لكل غرفة بشكل منفصل
  const [allMessages, setAllMessages] = useState<Record<RoomType, any[]>>({
    general: [{ sender: "المشرف", text: "مرحباً بك في القسم العام", isAdmin: true }],
    focus: [{ sender: "المشرف", text: "هنا نناقش أهدافك وتركيزك", isAdmin: true }],
    story: [{ sender: "المشرف", text: "شاركنا قصتك وإنجازاتك هنا", isAdmin: true }],
    center: [{ sender: "المشرف", text: "هنا تجد المصادر والمعلومات", isAdmin: true }],
  });

  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const wsUrl = "wss://zmdddd-advanced-comm-backend.hf.space/ws/chat";
    const ws = new WebSocket(wsUrl);
    socketRef.current = ws;

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        // نضع الرسالة في الغرفة المحددة القادمة من الـ Backend
        const room = (data.room as RoomType) || "general";
        setAllMessages((prev) => ({
          ...prev,
          [room]: [...prev[room], { sender: data.sender, text: data.text, isAdmin: data.isAdmin }]
        }));
      } catch (e) { console.error("Error parsing message", e); }
    };

    return () => ws.close();
  }, []);

  const handleSend = () => {
    if (input.trim() === "" || !socketRef.current) return;

    const messageData = {
      room: activeRoom, // نرسل اسم الغرفة الحالية
      sender: "أحمد",
      text: input
    };
    
    socketRef.current.send(JSON.stringify(messageData));
    
    // إضافة الرسالة محلياً للغرفة النشطة فقط
    setAllMessages(prev => ({
      ...prev,
      [activeRoom]: [...prev[activeRoom], { sender: "أنت", text: input, isAdmin: false }]
    }));
    setInput("");
  };

  return (
    <main className="min-h-screen bg-gray-50 p-4 md:p-8 flex flex-col md:flex-row gap-6 text-right" dir="rtl">
      
      <div className="flex-1 flex flex-col gap-6">
        {/* المربعات الثلاثة - الآن تعمل كمفاتيح تبديل للمحادثات */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div 
            onClick={() => setActiveRoom("focus")}
            className={`p-4 rounded-lg shadow-sm cursor-pointer transition border-2 ${activeRoom === 'focus' ? 'border-blue-500 bg-blue-100' : 'border-transparent bg-white'}`}
          >
            <h3 className="font-bold text-blue-800">محادثة التركيز</h3>
            <p className="text-xs text-blue-600">اضغط لفتح غرفة الأهداف</p>
          </div>

          <div 
            onClick={() => setActiveRoom("story")}
            className={`p-4 rounded-lg shadow-sm cursor-pointer transition border-2 ${activeRoom === 'story' ? 'border-purple-500 bg-purple-100' : 'border-transparent bg-white'}`}
          >
            <h3 className="font-bold text-purple-800">محادثة القصة</h3>
            <p className="text-xs text-purple-600">اضغط لفتح غرفة الإنجازات</p>
          </div>

          <div 
            onClick={() => setActiveRoom("center")}
            className={`p-4 rounded-lg shadow-sm cursor-pointer transition border-2 ${activeRoom === 'center' ? 'border-green-500 bg-green-100' : 'border-transparent bg-white'}`}
          >
            <h3 className="font-bold text-green-800">محادثة المركز</h3>
            <p className="text-xs text-green-600">اضغط لفتح غرفة المصادر</p>
          </div>
        </div>

        {/* مشغل الفيديو أو المحتوى */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex-1">
            <h2 className="text-xl font-bold mb-4">الغرفة النشطة: {
                activeRoom === 'focus' ? 'التركيز' : 
                activeRoom === 'story' ? 'القصة' : 
                activeRoom === 'center' ? 'المركز' : 'العامة'
            }</h2>
            <p className="text-gray-600">هنا يمكنك عرض محتوى خاص بكل غرفة (فيديو أو تعليمات) يتغير بتغير الغرفة.</p>
        </div>
      </div>

      {/* نظام المحادثة - يظهر رسائل الغرفة المختارة فقط */}
      <div className="w-full md:w-96 bg-white rounded-xl shadow-lg border border-gray-200 flex flex-col h-[80vh]">
        <div className={`p-4 rounded-t-xl text-white font-bold text-center ${
            activeRoom === 'focus' ? 'bg-blue-600' : 
            activeRoom === 'story' ? 'bg-purple-600' : 'bg-green-600'
        }`}>
          محادثة {activeRoom}
        </div>
        
        <div className="flex-1 p-4 overflow-y-auto bg-gray-50 space-y-3">
          {allMessages[activeRoom].map((msg, idx) => (
            <div key={idx} className={`flex flex-col ${msg.isAdmin ? 'items-start' : 'items-end'}`}>
              <div className={`max-w-[85%] p-3 rounded-2xl ${msg.isAdmin ? 'bg-white border text-gray-800' : 'bg-opacity-80 bg-blue-500 text-white'}`}>
                <span className="text-[10px] font-bold block">{msg.sender}</span>
                <p className="text-sm">{msg.text}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="p-3 border-t flex gap-2">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={`اكتب في غرفة ${activeRoom}...`}
            className="flex-1 border rounded-full px-4 py-2 text-sm focus:outline-none"
          />
          <button onClick={handleSend} className="bg-gray-800 text-white px-4 py-2 rounded-full">إرسال</button>
        </div>
      </div>
    </main>
  );
}