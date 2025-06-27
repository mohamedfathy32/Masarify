import React from "react";

function Footer() {
  return (
    <footer className="bg-[#0f0f0f] text-gray-300 border-t border-[#222] text-center py-3 sm:py-4 text-xs sm:text-sm lg:text-[15px] mt-auto px-4">
      © {new Date().getFullYear()} Masarify. جميع الحقوق محفوظة.
    </footer>
  );
}

export default Footer; 