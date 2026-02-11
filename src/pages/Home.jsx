import { useRef, useState } from "react";
import { motion, useMotionValue, animate } from "framer-motion";
import { ClipLoader } from "react-spinners";

import HeroBanner from "../components/HeroBanner";
import GenreChips from "../components/GenreChips";
import MovieRow from "../components/MovieRow";
import "./styles/Home.css";

import poster1 from "../assets/posters/Roane_And_The_Beast_2.png";
import poster2 from "../assets/posters/A_Moment_To_Maria.png";
import poster3 from "../assets/posters/It_Ends_With_Roane.png";
import poster4 from "../assets/posters/My_Sassy_Roane.png";
import poster5 from "../assets/posters/The_Fault_In_Roane's_Stars.png";
import poster6 from "../assets/posters/365_Days_With_Roane.png";
import poster7 from "../assets/posters/Shark_Attack.png";
import poster8 from "../assets/posters/Roane's_Execution.png";
import poster9 from "../assets/posters/Train_To_Roane.png";
import poster10 from "../assets/posters/Finding_Roane.png";

export default function Home() {
  const scrollRef = useRef(null);
  const y = useMotionValue(0); // vertical motion for pull indicator
  const [refreshing, setRefreshing] = useState(false);
  const [touchStart, setTouchStart] = useState(0);
  const [refreshKey, setRefreshKey] = useState(0); // key to trigger animation

const PULL_THRESHOLD = 15 // as % of dynamic viewport height
const pullThresholdPx = (PULL_THRESHOLD / 100) * window.innerHeight;  
  const REFRESH_DURATION = 1500; // ms

  // Hard-coded movies
  const continueWatching = [
    { id: "cw-1", poster: poster1, progress: 30 },
    { id: "cw-2", poster: poster2, progress: 60 },
  ];
  const recommended = [
    { id: "rec-1", poster: poster3 },
    { id: "rec-2", poster: poster4 },
    { id: "rec-3", poster: poster5 },
    { id: "rec-4", poster: poster2 },
  ];
  const trending = [
    { id: "tr-1", poster: poster6 },
    { id: "tr-2", poster: poster2 },
    { id: "tr-3", poster: poster7 },
    { id: "tr-4", poster: poster1 },
    { id: "tr-5", poster: poster3 },
  ];
  const newReleases = [
    { id: "nr-1", poster: poster8 },
    { id: "nr-2", poster: poster9 },
    { id: "nr-3", poster: poster10 },
    { id: "nr-4", poster: poster4 },
  ];

  // Touch handlers
  const handleTouchStart = (e) => {
    if (scrollRef.current.scrollTop === 0 && !refreshing) {
      setTouchStart(e.touches[0].clientY);
    }
  };

  const handleTouchMove = (e) => {
    if (touchStart === 0) return;
    let distance = e.touches[0].clientY - touchStart;
    if (distance > 0) {
      e.preventDefault();
      const damped = Math.pow(distance, 0.8);
      y.set(damped > 150 ? 150 : damped);
    }
  };

  const handleTouchEnd = () => {
    if (y.get() > pullThresholdPx && !refreshing) {
      setRefreshing(true);

      setTimeout(() => {
        setRefreshing(false);
        // Force re-render of content with new key to trigger animations
        setRefreshKey((prev) => prev + 1);
        animate(y, 0, { type: "spring", stiffness: 400, damping: 25 });
      }, REFRESH_DURATION);
    } else {
      animate(y, 0, { type: "spring", stiffness: 400, damping: 25 });
    }

    setTouchStart(0);
  };

  return (
    <div
      className="home"
      ref={scrollRef}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Pull-to-refresh indicator */}
      <motion.div className="refresh-indicator" style={{ height: y }}>
        <ClipLoader size={20} color="#fff" />
        <span style={{ marginLeft: "8px" }}>
          {refreshing ? "Refreshing..." : "Pull to refresh"}
        </span>
      </motion.div>

      {/* Content with motion animation on refresh */}
      <motion.div
        key={refreshKey} // changing key triggers re-animation
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 20, mass: 0.5 }}
      >
        <h1 className="home-title">Mariaflix</h1>
        <HeroBanner />
        <GenreChips />

        <MovieRow key="cw" title="Continue Watching" showProgress movies={continueWatching} />
        <MovieRow key="rec" title="Recommended" movies={recommended} />
        <MovieRow key="tr" title="Trending" movies={trending} />
        <MovieRow key="nr" title="New Releases" movies={newReleases} />
      </motion.div>
    </div>
  );
}