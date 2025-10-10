'use client'
import Image from "next/image";
import { Poppins, Inter } from 'next/font/google';
import { CheckCircle, ShieldAlert } from "lucide-react";
import { Button } from "../ui/button";
import Link from "next/link";



const poppins = Poppins({
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  subsets: ['latin'],
});

const inter = Inter({
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  subsets: ['latin'],
});

export default function Hero() {

  return (
    <section className="flex flex-col md:flex-row items-center justify-between px-8 md:px-16 py-8 md:py-12 max-w-[90%] mx-auto">
      <div className="md:w-1/2 space-y-6 text-center md:text-left">
        <div className="inline-block">

        </div>
        <h2 className={`${poppins.className} text-4xl md:text-6xl font-extrabold leading-tight text-gray-900`}>
          Connect with Students Who{' '}
          <span className="bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600 bg-clip-text text-transparent">
            Actually Get You
          </span>
        </h2>
        <p className={`${inter.className} text-lg md:text-xl text-gray-600 leading-relaxed max-w-lg`}>
          MatchHub is exclusively for verified college students. Connect with
          classmates, find study partners who become something more, and meet
          people who share your campus life—all in a safe, student-only space.        </p>
        <div className="flex gap-4 justify-center md:justify-start pt-4">
          <Button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 h-12 flex gap-x-2 rounded-full font-bold hover:shadow-xl hover:scale-105 transition-all">
            <span>
              <Image
                src="/tinder.png"
                alt="icon"
                width={4}
                height={4}
                className="w-full max-w-md h-auto object-cover"
                priority
              />
            </span>
            <span>Join Free</span>

          </Button>
          <Link href='#how-it-works' >
            <Button className="bg-white text-purple-600 border-2 border-purple-200 h-12 px-8 py-4 rounded-full font-bold hover:bg-purple-50 hover:border-purple-300 transition-all">
              How It Works
            </Button>
          </Link>
        </div>
        <div className="pt-8 text-center md:text-left space-y-3">
          <div className="flex items-center justify-center md:justify-start gap-3">
            <CheckCircle className="text-green-500 w-6 h-6" />
            <p className={`${inter.className} text-gray-700 text-base md:text-lg`}>
              Verified <span className="font-semibold text-gray-900">campus-only</span> profiles — every user is a real student.
            </p>
          </div>

          <div className="flex items-center justify-center md:justify-start gap-3">
            <ShieldAlert className="text-pink-500 w-6 h-6" />
            <p className={`${inter.className} text-gray-700 text-base md:text-lg`}>
              Report or block anyone who misbehaves — <span className="font-semibold text-gray-900">your safety comes first.</span>
            </p>
          </div>
        </div>

      </div>
      <div className="md:w-1/2 mt-12 md:mt-0 flex justify-center relative">
        <Image
          src="/dating.svg"
          alt="Dating Illustration"
          width={600}
          height={600}
          className="w-full max-w-md h-auto object-cover"
          priority
        />

      </div>
    </section >
  );
}