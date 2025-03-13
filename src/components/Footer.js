// components/Footer.js
import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram, FaYoutube, FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About section */}
          <div>
            <h3 className="text-lg font-semibold mb-4">TechStore</h3>
            <p className="text-gray-400 text-sm mb-4">
              Cửa hàng điện thoại, laptop chính hãng với giá cả cạnh tranh và dịch vụ chăm sóc khách hàng tốt nhất.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white">
                <FaFacebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <FaTwitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <FaInstagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <FaYoutube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Links section */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Liên kết nhanh</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-white text-sm">
                  Trang chủ
                </Link>
              </li>
              <li>
                <Link to="/products/phone" className="text-gray-400 hover:text-white text-sm">
                  Điện thoại
                </Link>
              </li>
              <li>
                <Link to="/products/laptop" className="text-gray-400 hover:text-white text-sm">
                  Laptop
                </Link>
              </li>
              <li>
                <Link to="#" className="text-gray-400 hover:text-white text-sm">
                  Khuyến mãi
                </Link>
              </li>
              <li>
                <Link to="#" className="text-gray-400 hover:text-white text-sm">
                  Tin tức công nghệ
                </Link>
              </li>
            </ul>
          </div>

          {/* Support section */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Hỗ trợ khách hàng</h3>
            <ul className="space-y-2">
              <li>
                <Link to="#" className="text-gray-400 hover:text-white text-sm">
                  Hướng dẫn mua hàng
                </Link>
              </li>
              <li>
                <Link to="#" className="text-gray-400 hover:text-white text-sm">
                  Chính sách đổi trả
                </Link>
              </li>
              <li>
                <Link to="#" className="text-gray-400 hover:text-white text-sm">
                  Chính sách bảo hành
                </Link>
              </li>
              <li>
                <Link to="#" className="text-gray-400 hover:text-white text-sm">
                  Phương thức thanh toán
                </Link>
              </li>
              <li>
                <Link to="#" className="text-gray-400 hover:text-white text-sm">
                  Câu hỏi thường gặp
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact section */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Liên hệ</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <FaMapMarkerAlt className="w-5 h-5 text-gray-400 mr-3 mt-1" />
                <span className="text-gray-400 text-sm">
                  268 Lý Thường Kiệt, Phường 14, Quận 10, Thành phố Hồ Chí Minh
                </span>
              </li>
              <li className="flex items-center">
                <FaPhoneAlt className="w-4 h-4 text-gray-400 mr-3" />
                <span className="text-gray-400 text-sm">0123 456 789</span>
              </li>
              <li className="flex items-center">
                <FaEnvelope className="w-4 h-4 text-gray-400 mr-3" />
                <span className="text-gray-400 text-sm">info@techstore.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-10 pt-6">
          <p className="text-center text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} TechStore. Tất cả các quyền được bảo lưu.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;