"use client";

import { useState, useEffect } from "react";

export default function Home() {
  const [userState, setUserState] = useState<"presence" | "focus" | "treatment">("presence");
  const [messages, setMessages] = useState<{ sender: string; text: string; isAdmin: boolean }[]>([
    { sender: "المشرف", text: "مرحباً بك، كيف يمكنني مساعدتك؟", isAdmin: true },
  ]);
  const [input, setInput] = useState("");

  // محاكاة اتصال WebSocket (سيتم ربطه بـ FastAPI لاحقاً)
  useEffect(() => {
    // هنا سيتم وضع كود الاتصال بـ ws://your-backend-url/ws
  }, []);

  const handleSend = () => {
    if (input.trim()) {
      setMessages([...messages, { sender: "أنت", text: input, isAdmin: false }]);
      setInput("");
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 p-4 md:p-8 flex flex-col md:flex-row gap-6">
      
      {/* القسم الأيسر: المحتوى الأساسي */}
      <div className="flex-1 flex flex-col gap-6">
        
        {/* 1. قسم الوسائط (مشغل الفيديو) */}
        <div className="w-full bg-black rounded-xl overflow-hidden aspect-video shadow-lg flex items-center justify-center">
          <div className="text-white text-center">
            <p className="text-xl font-bold">مشغل الفيديو الإرشادي</p>
            <p className="text-sm text-gray-400 mt-2">سيتم تشغيل المحتوى التوجيهي هنا</p>
          </div>
        </div>

        {/* 2. الشبكة التفاعلية (3 مربعات عرضية) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg shadow-sm hover:shadow-md transition cursor-pointer">
            <h3 className="font-bold text-blue-800 mb-2">التركيز</h3>
            <p className="text-sm text-blue-600">تحديد الأهداف والتركيز على الخطوات القادمة.</p>
          </div>
          <div className="bg-purple-50 border border-purple-200 p-4 rounded-lg shadow-sm hover:shadow-md transition cursor-pointer">
            <h3 className="font-bold text-purple-800 mb-2">القصة</h3>
            <p className="text-sm text-purple-600">رحلة المستخدم والإنجازات المحققة.</p>
          </div>
          <div className="bg-green-50 border border-green-200 p-4 rounded-lg shadow-sm hover:shadow-md transition cursor-pointer">
            <h3 className="font-bold text-green-800 mb-2">المركز</h3>
            <p className="text-sm text-green-600">الوصول للمصادر والمعلومات الهامة.</p>
          </div>
        </div>

        {/* 3. التدفق الديناميكي (حسب حالة المستخدم) */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-lg font-bold mb-4 text-gray-800">التدفق الديناميكي</h2>
          <div className="flex gap-2 mb-4">
            <button onClick={() => setUserState("presence")} className={`px-3 py-1 rounded-full text-sm ${userState === 'presence' ? 'bg-gray-800 text-white' : 'bg-gray-200'}`}>في حال وجود</button>
            <button onClick={() => setUserState("focus")} className={`px-3 py-1 rounded-full text-sm ${userState === 'focus' ? 'bg-gray-800 text-white' : 'bg-gray-200'}`}>تركيز</button>
            <button onClick={() => setUserState("treatment")} className={`px-3 py-1 rounded-full text-sm ${userState === 'treatment' ? 'bg-gray-800 text-white' : 'bg-gray-200'}`}>العلاج</button>
          </div>
          
          <div className="space-y-3">
            {userState === "presence" && (
              <div className="p-3 bg-yellow-50 border-l-4 border-yellow-500 text-yellow-800 rounded">
                مرحلة التواجد: يرجى تأكيد حضورك واستعراض المعلومات الأولية.
              </div>
            )}
            {userState === "focus" && (
              <div className="p-3 bg-blue-50 border-l-4 border-blue-500 text-blue-800 rounded">
                مرحلة التركيز: يرجى الانتباه للخطوات التفصيلية المطلوبة منك.
              </div>
            )}
            {userState === "treatment" && (
              <>
                <div className="p-3 bg-red-50 border-l-4 border-red-500 text-red-800 rounded">
                  مرحلة العلاج: خطة العلاج الخاصة بك (صندوق المشرف - للقراءة فقط).
                </div>
                {/* صندوق المشرف (غير قابل للتعديل من المستخدم) */}
                <div className="p-3 bg-gray-100 border border-gray-300 rounded relative">
                  <span className="absolute top-2 left-2 bg-red-600 text-white text-xs px-2 py-0.5 rounded">مشرف</span>
                  <p className="text-gray-700 mt-4">توصية المشرف: الالتزام بالبرنامج المحدد دون تأجيل.</p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* القسم الأيمن: نظام المحادثة (تشبه الواتساب) */}
      <div className="w-full md:w-96 bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col h-[80vh]">
        <div className="bg-green-600 p-4 rounded-t-xl text-white font-bold text-center">
          المحادثة الفورية
        </div>
        
        <div className="flex-1 p-4 overflow-y-auto bg-gray-50 space-y-3">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex flex-col ${msg.isAdmin ? 'items-start' : 'items-end'}`}>
              <div className={`max-w-[80%] p-3 rounded-xl shadow-sm ${msg.isAdmin ? 'bg-white border border-gray-200 text-gray-800' : 'bg-green-100 text-green-900'}`}>
                <span className="text-xs font-bold block mb-1">{msg.sender}</span>
                {msg.text}
              </div>
            </div>
          ))}
        </div>

        <div className="p-3 bg-white border-t flex gap-2">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="اكتب رسالتك..." 
            className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:border-green-500"
          />
          <button 
            onClick={handleSend}
            className="bg-green-600 text-white px-4 py-2 rounded-full hover:bg-green-700 transition"
          >
            إرسال
          </button>
        </div>
      </div>

    </main>
  );
}