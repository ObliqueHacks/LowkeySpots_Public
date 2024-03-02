import React from "react";
import Skeleton from "react-loading-skeleton";

const CardSkeleton = ({ cards }: { cards: number }) => {
  const renderSkeletons = () =>
    Array.from({ length: cards }, (_, i) => (
      <li className="card-skeleton" key={i}>
        <div className="row-1">
          <Skeleton duration={1} height={140} />
        </div>
        <div className="row-2">
          <Skeleton duration={1} height={30} count={2} />
        </div>
      </li>
    ));

  return <React.Fragment>{renderSkeletons()}</React.Fragment>;
};

export default CardSkeleton;
