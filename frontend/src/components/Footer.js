import React from 'react';

const Footer = () => (
  <footer className="bg-gray-100 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 text-center p-8 mt-0">
    <div className="max-w-4xl mx-auto">
      <div className="mb-4">
        <h2 className="text-lg font-bold text-green-700 dark:text-green-300 mb-2">About Us</h2>
        <p className="text-gray-700 dark:text-gray-300 text-sm">
          <b>SmartChef AI</b> is your intelligent kitchen companion, designed to make cooking easier, healthier, and more enjoyable. Our platform leverages AI to suggest creative recipes based on your available ingredients, helps you plan weekly meals, and provides step-by-step voice-guided instructions. Whether you're a beginner or a seasoned chef, SmartChef AI empowers you to explore new cuisines, manage your dietary preferences, and track your culinary journey. <br /><br />
          <b>Contact:</b> support@smartchefai.com<br />
          <b>Location:</b> 123 Culinary Lane, Food City, 45678<br />
          <b>Our Mission:</b> To inspire creativity in the kitchen and promote healthy, sustainable eating for everyone.
        </p>
      </div>
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-6">© 2025 SmartChef AI. All rights reserved.</p>
    </div>
  </footer>
);

export default Footer;
