import React, { useEffect, useState } from 'react';
import '../App.css'

const Reviews = ({ reviews }) => {
  const [seeAll, setSeeAll] = useState([]);

  useEffect(() => {
    setSeeAll(Array(reviews.length).fill(false))
  },[reviews])

  const handleText = (i) => {
    const newSeeAll = [...seeAll];
    newSeeAll[i] = !newSeeAll[i];
    setSeeAll(newSeeAll);
  };
  return (
    <>
      <div className="container max-w-2xl grid grid-cols-1 gap-2">
        {reviews.map((rv, i) => (
          <div
            key={i}
            className={`border border-dotted rounded-xl p-2 ${
              seeAll == false ? 'max-h-50 text-ellipsis' : 'max-h-full'
            }`}
          >
            <p>
              <strong>이름</strong> : {rv.author_name}
            </p>
            <p>
              <strong>사용자 평점</strong> : {rv.rating}☆
            </p>
            <div>
              <strong>사용자 평가</strong> <br />
              <p
                className={`mouse_pointer indent-2 ${seeAll[i] ? 'line-clamp-none' : 'line-clamp-2'}`}
                onClick={() => handleText(i)}
              >
                {rv.text}
              </p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default Reviews;
