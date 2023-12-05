import React, { useEffect, useState } from 'react';
import axios from 'axios';
import jwt_decode from 'jwt-decode';
import './Gallery.css';
import avions from '../images/travelnotes.png';
import Masonry from 'react-layout-masonry';
import { RiDeleteBin5Fill } from 'react-icons/ri';
import { FaRegCommentDots, FaPen } from 'react-icons/fa';

const Gallery = () => {
  const [file, setFile] = useState(null);
  const [comment, setComment] = useState('');
  const [galleryItems, setGalleryItems] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [likes, setLikes] = useState(() => {
    const storedLikes = localStorage.getItem('likes');
    return storedLikes ? JSON.parse(storedLikes) : {};
  });
  const [dislikes, setDislikes] = useState(() => {
    const storedDislikes = localStorage.getItem('dislikes');
    return storedDislikes ? JSON.parse(storedDislikes) : {};
  });
  const [showQuestionInput, setShowQuestionInput] = useState(false);
  const [comments, setComments] = useState(() => {
    const storedComments = localStorage.getItem('comments');
    return storedComments ? JSON.parse(storedComments) : {};
  });
  const [commentInResponse, setCommentInResponse] = useState('');
  const [selectedItemId, setSelectedItemId] = useState(null);

  const handleImageChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleCommentChange = (e) => {
    setComment(e.target.value);
  };

  const handleDelete = (itemId) => {
    if (isAdmin) {
      axios
        .delete(`http://localhost:8080/galleryItem/${itemId}`)
        .then(() => {
          loadGalleryItems();
        })
        .catch((err) => {
          console.log('Error deleting image:', err);
        });
    } else {
      alert('Not allowed to delete items');
    }
  };

  const handleClick = async () => {
    if (!isLoggedIn) {
      alert('Log in to share your experience');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('comment', comment);

    const token = localStorage.getItem('token');
    const decoded = jwt_decode(token);
    const userId = decoded.userId;

    try {
      const response = await axios.get(`http://localhost:8080/user/${userId}`);
      const user = response.data;
      const username = user.username;
      setIsAdmin(user.isAdmin);

      formData.append('username', username);

      axios
        .post('http://localhost:8080/upload', formData)
        .then(() => {
          setFile(null);
          setComment('');
          loadGalleryItems();
        })
        .catch((err) => console.log(err));
    } catch (error) {
      console.log('Error retrieving user information:', error);
    }
  };

  const loadGalleryItems = () => {
    axios
      .get('http://localhost:8080/getImage')
      .then((res) => {
        setGalleryItems(res.data);
      })
      .catch((err) => console.log(err));
  };

  const handleLikeClick = (itemId) => {
    if (isLoggedIn) {
      const updatedLikes = { ...likes };
      updatedLikes[itemId] = (updatedLikes[itemId] || 0) + 1;
      setLikes(updatedLikes);

      localStorage.setItem('likes', JSON.stringify(updatedLikes));
    } else {
      alert('Log in to like photos');
    }
  };

  const handleCommentClick = (itemId) => {
    setSelectedItemId(itemId);
    setShowQuestionInput(true);
  };

  const handlePostCommentClick = async () => {
    if (selectedItemId) {
      try {
        const token = localStorage.getItem('token');
        const decoded = jwt_decode(token);
        const userId = decoded.userId;

        const response = await axios.get(`http://localhost:8080/user/${userId}`);
        const user = response.data;
        const username = user.username;

        const updatedComments = { ...comments };
        updatedComments[selectedItemId] = [
          ...(updatedComments[selectedItemId] || []),
          `${username}: ${commentInResponse}`,
        ];

        setComments(updatedComments);
        setShowQuestionInput(false);
        setCommentInResponse('');
        setSelectedItemId(null);

        localStorage.setItem('comments', JSON.stringify(updatedComments));
      } catch (error) {
        console.error('Error retrieving user information:', error);
      }
    }
  };

  const handleCommentInResponseChange = (e) => {
    setCommentInResponse(e.target.value);
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
    loadGalleryItems();
  }, []);

  useEffect(() => {
    return () => {
      localStorage.setItem('likes', JSON.stringify(likes));
      localStorage.setItem('dislikes', JSON.stringify(dislikes));
      localStorage.setItem('comments', JSON.stringify(comments));
    };
  }, [likes, dislikes, comments]);

  const handledisLikeClick = (itemId) => {
    if (isLoggedIn) {
      const updatedDislikes = { ...dislikes };
      updatedDislikes[itemId] = (updatedDislikes[itemId] || 0) + 1;
      setDislikes(updatedDislikes);

      localStorage.setItem('dislikes', JSON.stringify(updatedDislikes));
    } else {
      alert('Log in to dislike photos');
    }
  };

  return (
    <>
      <div className='customer-experience'>
        <h1>Share your travel experience with us!</h1>
        {isLoggedIn ? (
          <div className='memory'>
            <img src={avions} alt='memory' />
            <div>
              <h3>Add a Photo</h3>
              <input type='file' onChange={handleImageChange} className='inputfile' />
              <h3>Add a comment</h3>
              <input type='text' value={comment} onChange={handleCommentChange} />
              <button onClick={handleClick}>Upload</button>
            </div>
          </div>
        ) : (
          <p>Log in to share your experience</p>
        )}
      </div>

      <Masonry
        columns={{ 640: 1, 768: 2, 1024: 3, 1280: 5 }}
        gap={16}
        className='GalleryItem'
      >
        {galleryItems.map((item, index) => (
          <div className='Gitem' key={index}>
            <img src={`http://localhost:8080/uploads/` + item.image} alt='img' />
            <p>
              <span>Comment:</span>
              {item.comment}
            </p>
            <p>
              <span>Uploaded by:</span> {item.username}
            </p>
            <p>
              <span>Date:</span> {new Date(item.createdAt).toDateString()}
            </p>
            <div className='actions-container'>
              <div className='iconss'>
                <div className='likes-container'>
                  <button onClick={() => handleLikeClick(item._id)}>❤️</button>
                  <span>{likes[item._id] || 0}</span>
                </div>

                <div className='dislikes-container'>
                  <button onClick={() => handledisLikeClick(item._id)}>😕</button>
                  <span>{dislikes[item._id] || 0}</span>
                </div>

                <button onClick={() => handleCommentClick(item._id)}>
                  <FaRegCommentDots />
                </button>
                {isAdmin ? (
                  <button onClick={() => handleDelete(item._id)} className='del'>
                    <RiDeleteBin5Fill />
                  </button>
                ) : (
                  <button disabled={true} className='del'>
                    <RiDeleteBin5Fill />
                  </button>
                )}
              </div>
            </div>
            {showQuestionInput && selectedItemId === item._id && (
              <div className='question-input-container'>
                <input
                  type='text'
                  placeholder='Add a comment'
                  value={commentInResponse}
                  onChange={handleCommentInResponseChange}
                />
                <button onClick={handlePostCommentClick}>
                  <FaPen />
                </button>
              </div>
            )}
            {comments[item._id] && comments[item._id].length > 0 && (
              <div className='questions-container'>
                <ul>
                  {comments[item._id].map((q, index) => (
                    <li key={index}>{q}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </Masonry>
    </>
  );
};

export default Gallery;
