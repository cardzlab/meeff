import React, { useState } from "react";
import ReactLightbox from "react-image-lightbox";
import "react-image-lightbox/style.css";

const Lightbox = ({ user, like, dislike }) => {
  const [imageIndex, setImageIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  if (!user.photoUrls || user.photoUrls.length === 0) {
    dislike(user._id);
    return null;
  }

  return (
    <div>
      <h1>{user.name}</h1>
      <p>{user.description}</p>
      <div>
        Birth Year: {user.birthYear}
        <br />
        Distance: {user.distance}
      </div>


      { user.photoUrls.map(url => (
        <img alt="girl" src={url} style={{maxWidth: "400px"}} />
      ))}
      <br />
      <button onClick={() => setIsOpen(true)} className="btn btn-secondary">Open Lightbox</button>
      {isOpen ? (
        <ReactLightbox
          mainSrc={user.photoUrls[imageIndex]}
          nextSrc={user.photoUrls[(imageIndex + 1) % user.photoUrls.length]}
          prevSrc={
            user.photoUrls[
              (imageIndex + user.photoUrls.length - 1) % user.photoUrls.length
            ]
          }
          onCloseRequest={() => setIsOpen(false)}
          onMovePrevRequest={() =>
            setImageIndex(
              (imageIndex + user.photoUrls.length - 1) % user.photoUrls.length
            )
          }
          onMoveNextRequest={() =>
            setImageIndex((imageIndex + 1) % user.photoUrls.length)
          }
        />
      ) : null}

      <br />
      <button onClick={() => like(user._id)} className="btn btn-success">Like</button>
      <button onClick={() => dislike(user._id)} className="btn btn-danger">Dislike</button>
      <hr />
    </div>
  );
};

export default Lightbox;
