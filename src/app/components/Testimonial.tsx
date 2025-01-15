import React, { useState } from "react";
import Slider from "react-slick";
import Image from "next/image";
import * as Stars from "../public/assets/Icon/stars.svg";
import * as ArrowBack from "../public/assets/Icon/eva_arrow-back-fill.svg";
import * as ArrowNext from "../public/assets/Icon/eva_arrow-next-fill.svg";
import Link from "next/link";

interface Testimoni {
  name: string;
  image: string;
  city: string;
  country: string;
  rating: string;
  testimoni: string;
}

interface TestimoniProps {
  listTestimoni?: Testimoni[];
}

const Testimoni: React.FC<TestimoniProps> = ({
  listTestimoni = [
    {
      name: "Iezh Robert",
      image: "/assets/people-3.png",
      city: "Warsaw",
      country: "Poland",
      rating: "4.5",
      testimoni:
        "Wow... I am very happy to use this VPN, it turned out to be more than my expectations and so far there have been no problems. LaslesVPN always the best",
    },
    {
      name: "John Doe",
      image: "/assets/people-3.png",
      city: "Berlin",
      country: "Germany",
      rating: "4.8",
      testimoni:
        "This VPN has changed the way I connect online. Highly recommend it to everyone who values their privacy.",
    },
  ],
}) => {
  const settings = {
    dots: true,
    customPaging: (i: number) => (
      <Link href={"/"}>
        <span className="mx-2 rounded-full h-4 w-4 block cursor-pointer transition-all bg-gray-300"></span>
      </Link>
    ),
    dotsClass: "slick-dots w-max absolute mt-20",
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 2,
    responsive: [
      {
        breakpoint: 770,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  const [sliderRef, setSliderRef] = useState<Slider | null>(null);

  return (
    <>
      <Slider
        {...settings}
        arrows={false}
        ref={setSliderRef as React.LegacyRef<Slider>}
        className="flex items-stretch justify-items-stretch"
      >
        {listTestimoni.map((item, index) => (
          <div className="px-3 flex items-stretch" key={index}>
            <div className="border-2 border-gray-500 hover:border-orange-500 transition-all rounded-lg p-8 flex flex-col">
              <div className="flex flex-col xl:flex-row w-full items-stretch xl:items-center">
                <div className="flex order-2 xl:order-1">
                  <Image
                    src={item.image}
                    height={50}
                    width={50}
                    alt={item.name}
                    priority
                    placeholder="empty"
                  />
                  <div className="flex flex-col ml-5 text-left">
                    <p className="text-lg text-black-600 capitalize">
                      {item.name}
                    </p>
                    <p className="text-sm text-black-500 capitalize">
                      {item.city}, {item.country}
                    </p>
                  </div>
                </div>
                <div className="flex flex-none items-center ml-auto order-1 xl:order-2">
                  <p className="text-sm">{item.rating}</p>
                  <span className="flex ml-4">
                    {/* <Stars.default className="h-4 w-4" /> */}
                  </span>
                </div>
              </div>
              <p className="mt-5 text-left">“{item.testimoni}”.</p>
            </div>
          </div>
        ))}
      </Slider>
      <div className="flex w-full items-center justify-end">
        <div className="flex flex-none justify-between w-auto mt-14">
          <div
            className="mx-4 flex items-center justify-center h-14 w-14 rounded-full bg-white border-orange-500 border hover:bg-orange-500 hover:text-white transition-all text-orange-500 cursor-pointer"
            onClick={() => sliderRef?.slickPrev()}
          >
            {/* <ArrowBack.default className="h-6 w-6" /> */}
          </div>
          <div
            className="flex items-center justify-center h-14 w-14 rounded-full bg-white border-orange-500 border hover:bg-orange-500 hover:text-white transition-all text-orange-500 cursor-pointer"
            onClick={() => sliderRef?.slickNext()}
          >
            {/* <ArrowNext.default className="h-6 w-6" /> */}
          </div>
        </div>
      </div>
    </>
  );
};

export default Testimoni;
