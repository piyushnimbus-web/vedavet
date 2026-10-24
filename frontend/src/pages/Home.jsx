import React from "react";
import "./HomeOriginal.css";
import HomeHero from "../components/home/HomeHero";
import HomeAbout from "../components/home/HomeAbout";
import HomeServices from "../components/home/HomeServices";
import HomeWhyChoose from "../components/home/HomeWhyChoose";
import HomeProducts from "../components/home/HomeProducts";
import HomeWhatWeDo from "../components/home/HomeWhatWeDo";
import HomeBenefits from "../components/home/HomeBenefits";
import HomePricing from "../components/home/HomePricing";
import HomeTestimonials from "../components/home/HomeTestimonials";
import HomeBlogs from "../components/home/HomeBlogs";

export default function Home(){
  return <main className="vedavet-original-home">
    <HomeHero />
    <HomeAbout />
    <HomeServices />
    <HomeWhyChoose />
    <HomeProducts />
    <HomeWhatWeDo />
    <HomeBenefits />
    <HomePricing />
    <HomeTestimonials />
    <HomeBlogs />
  </main>;
}
