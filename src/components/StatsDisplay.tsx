'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from '@/components/I18nProvider';

const motivationalMessages = [
  "Thousands of decisions made daily!",
  "Join millions making smart choices!",
  "Quick decisions, better outcomes!",
  "Making life easier, one pick at a time!",
  "Your decision companion since 2024!"
];

const motivationalMessagesBn = [
  "প্রতিদিন হাজারো সিদ্ধান্ত নেওয়া হচ্ছে!",
  "লক্ষ লক্ষ মানুষের সাথে স্মার্ট পছন্দ করুন!",
  "দ্রুত সিদ্ধান্ত, ভালো ফলাফল!",
  "জীবনকে সহজ করে তুলছি, একটি পছন্দে!",
  "২০২৪ সাল থেকে আপনার সিদ্ধান্তের সঙ্গী!"
];

export default function StatsDisplay() {
  const { locale } = useTranslation();
  const [currentMessage, setCurrentMessage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessage((prev) => {
        const messages = locale === 'bn' ? motivationalMessagesBn : motivationalMessages;
        return (prev + 1) % messages.length;
      });
    }, 4000); // Change message every 4 seconds

    return () => clearInterval(interval);
  }, [locale]);

  const messages = locale === 'bn' ? motivationalMessagesBn : motivationalMessages;

  return (
    <div className="text-center py-4">
      <div className="bg-gradient-to-r from-green-100 to-orange-100 dark:from-green-900/20 dark:to-orange-900/20 rounded-lg p-3 border border-green-200 dark:border-green-700">
        <p className="text-sm text-green-700 dark:text-green-300 font-medium animate-pulse">
          ✨ {messages[currentMessage]}
        </p>
      </div>
    </div>
  );
}