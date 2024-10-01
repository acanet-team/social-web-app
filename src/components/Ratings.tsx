import React from "react";
import styles from "@/styles/modules/ratings.module.scss";

interface RatingProps {
  rating: number;
  size: number;
}

const Ratings: React.FC<RatingProps> = ({ rating, size }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className={styles.rating}>
      {Array(fullStars)
        .fill(true)
        .map((_, index) => (
          <span
            key={`full-${index}`}
            className={styles.filled}
            style={{ fontSize: `${size}px` }}
          >
            ★
          </span>
        ))}
      {hasHalfStar && (
        <span
          key="half"
          className={styles.half}
          style={{ fontSize: `${size}px` }}
        >
          ★
        </span>
      )}
      {Array(emptyStars)
        .fill(false)
        .map((_, index) => (
          <span
            key={`empty-${index}`}
            className={styles.empty}
            style={{ fontSize: `${size}px` }}
          >
            ★
          </span>
        ))}
    </div>
  );
};

export default Ratings;
