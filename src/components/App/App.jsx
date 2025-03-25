import { useState, useEffect } from 'react';
import Modal from 'react-modal';
import searchImage from '../../unsplash-api';
import MoonLoader from 'react-spinners/MoonLoader';
import SearchBar from '../SearchBar/SearchBar';
import ImageGallery from '../ImageGallery/ImageGallery';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import LoadMoreBtn from '../LoadMoreBtn/LoadMoreBtn';
import css from './App.module.css';

Modal.setAppElement('#root');

// modal styles
const customStyles = {
  content: {
    right: '50%',
    left: '',
    transform: 'translateX(50%)',
    overflow: 'hidden',
  },
  overlay: {
    backgroundColor: '#000000b9',
  },
};

export default function App() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [image, setImage] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [modalIsOpen, setIsOpen] = useState(false);
  const [modalImage, setModalImage] = useState(null);

  // modal action functions
  function openModal(imgUrl) {
    setModalImage(imgUrl);
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
    setModalImage(null);
  }

  // search image functions
  const handleImgSearch = queryImg => {
    setSearchQuery(queryImg);
    setPage(1);
    setImage([]);
  };

  const hadleBtnMoreClick = () => {
    setPage(page + 1);
  };

  useEffect(() => {
    if (searchQuery === '') {
      return;
    }

    async function getData() {
      try {
        setError(false);
        setLoading(true);
        const data = await searchImage(searchQuery, page);
        setImage(prevImage => [...prevImage, ...data.results]);
        setTotalPage(data.total_pages);
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    getData();
  }, [searchQuery, page]);

  return (
    <>
      <SearchBar onSearch={handleImgSearch} />

      <div className={css.container}>
        {image.length > 0 && (
          <ImageGallery items={image} onOpenModal={openModal} />
        )}

        <MoonLoader loading={loading} size="40px" className={css.loader} />

        {error && <ErrorMessage />}

        {image.length > 0 && !loading && page < totalPage && (
          <LoadMoreBtn onClick={hadleBtnMoreClick} />
        )}
      </div>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
      >
        <img className={css.modal_img} src={modalImage} />
      </Modal>
    </>
  );
}
