import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { FiAlignJustify } from "react-icons/fi";

const Navbar = ({ onOpenSidenav, brandText: initialBrandText }) => {
  // State untuk mengatur mode gelap dan teks merek
  const [darkMode, setDarkMode] = useState(false);
  const [brandText, setBrandText] = useState(initialBrandText);

  // Mendapatkan data dari Redux store (misalnya, informasi pengguna dan halaman mikro)
  const { microPage, user } = useSelector((state) => state.auth);

  // Memperbarui brandText saat microPage berubah
  useEffect(() => {
    setBrandText(microPage !== "unset" ? microPage : initialBrandText);
  }, [microPage, initialBrandText]);

  // Fungsi untuk mengubah mode gelap
  const toggleDarkMode = () => {
    if (darkMode) {
      document.body.classList.remove("dark");
    } else {
      document.body.classList.add("dark");
    }
    setDarkMode(!darkMode);
  };

  return (
    <nav className="sticky top-4 z-40 flex flex-row flex-wrap items-center justify-between rounded-xl bg-white/10 p-2 backdrop-blur-xl dark:bg-[#0b14374d]">
      <div className="ml-[6px]">
        <div className="h-6 w-[224px] pt-1">
          <a
            className="text-sm font-normal text-navy-700 hover:underline dark:text-white dark:hover:text-white"
            href=" "
          >
            Pages {user ? user.name : 'User'}
            <span className="mx-1 text-sm text-navy-700 hover:text-navy-700 dark:text-white">
              {" "} /{" "}
            </span>
          </a>
          <Link
            className="text-sm font-normal capitalize text-navy-700 hover:underline dark:text-white dark:hover:text-white"
            to="#"
          >
            {brandText}
          </Link>
        </div>
        <p className="shrink text-[33px] capitalize text-navy-700 dark:text-white">
          <Link
            to="#"
            className="font-bold capitalize hover:text-navy-700 dark:hover:text-white"
          >
            {brandText}
          </Link>
        </p>
      </div>

      <div className="relative mt-[3px] flex h-[61px] w-auto flex-grow items-center justify-end gap-2 rounded-full bg-white px-4 py-2 shadow-xl shadow-shadow-500 dark:!bg-navy-800 dark:shadow-none md:flex-grow-0 md:gap-1">
        <span
          className="flex cursor-pointer text-xl text-gray-600 dark:text-white xl:hidden"
          onClick={onOpenSidenav}
        >
          <FiAlignJustify className="h-5 w-5" />
        </span>

        {/* Logout Button */}
        <a
          href=" "
          className="ml-auto text-sm font-medium text-red-500 hover:text-red-500 transition duration-150 ease-out hover:ease-in"
        >
          Log Out
        </a>
      </div>
    </nav>
  );
};

export default Navbar;
