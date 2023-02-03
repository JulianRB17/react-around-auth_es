import React from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import '../index.css';
import Header from './Header';
import Main from './Main';
import Footer from './Footer';
import PopupWithForm from './PopupWithForm';
import ImagePopup from './ImagePopup';
import EditProfilePopup from './EditProfilePopup.js';
import api from '../utils/api';
import Card from './Card';
import { CurrentUserContext } from '../contexts/CurrentUserContext';
import EditAvatarPopup from './EditAvatarPopup';
import AddPlacePopup from './AddPlacePopup';
import { register, authorize, checkToken } from '../utils/auth';
import Register from '../components/Register';
import Login from '../components/Login';
import InfoTooltip from './InfoTooltip';
import ProtectedRoute from './ProtectedRoute';

export default function App() {
  const [isEditProfilePopupOpen, setEditProfilePopupOpen] =
    React.useState(false);
  const [isAvatarProfilePopupOpen, setAvatarProfilePopupOpen] =
    React.useState(false);
  const [isAddPlacePopupOpen, setAddPlacePopupOpen] = React.useState(false);
  const [popupEraseCard, setPopupEraseCard] = React.useState(false);
  const [popupPic, setPopupPic] = React.useState(false);
  const [selectedCard, setSelectedCard] = React.useState('');
  const [currentUser, setCurrentUser] = React.useState({});
  const [cards, setCards] = React.useState([]);
  const [newPlace, setNewPlace] = React.useState('');
  const [newPlaceCaption, setNewPlaceCaption] = React.useState('');
  const [userName, setUserName] = React.useState('');
  const [userDescription, setUserDescription] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [isPopupAuthOpen, setPopupAuthOpen] = React.useState(false);
  const [isAuthorized, setAuthorized] = React.useState(false);
  const [jwt, setJwt] = React.useState('');
  const navigate = useNavigate();
  const navigation = React.useRef(useNavigate());

  React.useEffect(() => {
    api
      .getUserInfo(jwt)
      .then((userInfo) => setCurrentUser(userInfo))
      .catch((err) => console.error(err));
  }, []);

  React.useEffect(() => {
    api
      .getInitialCards()
      .then((cards) => {
        setCards(cards);
      })
      .catch((err) => console.error(err));
  }, []);

  React.useEffect(() => {
    if (localStorage.getItem('jwt')) {
      setJwt(localStorage.getItem('jwt'));
      checkToken(jwt).then((res) => {
        if (res) {
          setEmail(res.data.email);
          setAuthorized(true);
        }
      });
    }
  }, []);

  React.useEffect(() => {
    navigation.current('/');
  }, [navigation]);

  function closeAllPopups() {
    setAvatarProfilePopupOpen(false);
    setEditProfilePopupOpen(false);
    setAddPlacePopupOpen(false);
    setPopupEraseCard(false);
    setPopupPic(false);
    setSelectedCard('');
    setPopupAuthOpen(false);
  }

  function handleEditAvatarClick() {
    setAvatarProfilePopupOpen(true);
  }

  function handleAddPlaceClick() {
    setAddPlacePopupOpen(true);
  }

  function handleEditProfileClick() {
    setEditProfilePopupOpen(true);
  }

  function handleCardClick(card) {
    setSelectedCard(card);
    setPopupPic(true);
  }

  function handleUpdateUser(data) {
    api
      .changeUserInfo(data)
      .then((data) => setCurrentUser(data))
      .catch((err) => console.error(err));
    closeAllPopups();
  }

  function handleUpdateAvatar(data) {
    api
      .setProfilePic(data)
      .then((data) => setCurrentUser(data))
      .catch((err) => console.error(err));
    closeAllPopups();
  }

  function handleAddPlaceSubmit(data) {
    api
      .setNewPlace(data)
      .then((newCard) => setCards([newCard, ...cards]))
      .catch((err) => console.error(err));
    closeAllPopups();
  }

  function handleCardLike(card) {
    const isLiked = card.likes.some((i) => i._id === currentUser._id);
    api
      .toggleLikeBtn(card._id, isLiked)
      .then((newCard) => {
        setCards((state) =>
          state.map((c) => (c._id === card._id ? newCard : c))
        );
      })
      .catch((err) => console.error(err));
  }

  function handleCardDelete(card) {
    api
      .deleteCard(card._id)
      .then((deletedCardId) =>
        setCards((state) =>
          state.filter((card) => (card._id === deletedCardId ? '' : card))
        )
      )
      .catch((err) => console.error(err));
  }

  function handleUserRegistration() {
    register(email, password)
      .then((res) => {
        if (res) {
          setPassword('');
          navigate('/', { replace: true });
          setAuthorized(true);
          setPopupAuthOpen(true);
        } else {
          throw new Error('Algo salió mal');
        }
      })
      .catch((err) => console.log(err));
  }

  function handleUserLogin() {
    authorize(email, password)
      .then((res) => {
        if (res) {
          setPassword('');
          navigate('/', { replace: true });
          setAuthorized(true);
        }
      })
      .catch((err) => console.error('Algo salió mal:' + err))
      .finally(() => setPopupAuthOpen(true));
  }

  function handleLogout() {
    setEmail('');
    setJwt('');
    setAuthorized(false);
    localStorage.removeItem('jwt');
  }

  function handleNewPlaceCaptionChange(e) {
    setNewPlaceCaption(e.target.value);
  }

  function handleNewPlaceChange(e) {
    setNewPlace(e.target.value);
  }

  function handleUserNameChange(e) {
    setUserName(e.target.value);
  }

  function handleUserDescriptionChange(e) {
    setUserDescription(e.target.value);
  }

  function handleEmailChange(e) {
    setEmail(e.target.value);
  }

  function handlePasswordChange(e) {
    setPassword(e.target.value);
  }

  const renderCards = () =>
    cards.map((card) => {
      const { _id, owner, link, name, likes } = card;

      return (
        <Card
          key={_id}
          cardId={_id}
          cardOwnerId={owner._id}
          link={link}
          cardName={name}
          cardLikes={likes}
          onCardDelete={() => handleCardDelete(card)}
          onCardClick={() => handleCardClick(card)}
          onCardLike={() => handleCardLike(card)}
        />
      );
    });

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <Routes>
        <Route
          path="/signup"
          element={
            <div className="body-container">
              <Header email={email} isAuthorized={isAuthorized} />
              <InfoTooltip
                onClose={closeAllPopups}
                isOpen={isPopupAuthOpen}
                isAuthorized={isAuthorized}
              />
              <Register
                onPasswordChange={handlePasswordChange}
                onEmailChange={handleEmailChange}
                onRegister={handleUserRegistration}
              />
            </div>
          }
        />
        <Route
          path="/signin"
          element={
            <div className="body-container">
              <Header email={email} isAuthorized={isAuthorized} />
              <InfoTooltip
                onClose={closeAllPopups}
                isOpen={isPopupAuthOpen}
                isAuthorized={isAuthorized}
              />
              <Login
                onPasswordChange={handlePasswordChange}
                onEmailChange={handleEmailChange}
                onLogin={handleUserLogin}
              />
            </div>
          }
        />
        <Route
          path="/"
          element={
            <ProtectedRoute isAuthorized={isAuthorized}>
              <div className="body-container">
                <Header
                  email={email}
                  isAuthorized={isAuthorized}
                  onLogout={handleLogout}
                />
                <InfoTooltip
                  onClose={closeAllPopups}
                  isOpen={isPopupAuthOpen}
                  isAuthorized={isAuthorized}
                />
                <EditAvatarPopup
                  isOpen={isAvatarProfilePopupOpen}
                  onClose={closeAllPopups}
                  onUpdateAvatar={handleUpdateAvatar}
                />
                <EditProfilePopup
                  isOpen={isEditProfilePopupOpen}
                  onClose={closeAllPopups}
                  onUpdateUser={handleUpdateUser}
                  onUserNameChange={handleUserNameChange}
                  onUserDescriptionChange={handleUserDescriptionChange}
                  setUserDescription={setUserDescription}
                  setUserName={setUserName}
                  name={userName}
                  about={userDescription}
                />

                <AddPlacePopup
                  isOpen={isAddPlacePopupOpen}
                  onClose={closeAllPopups}
                  onAddPlaceSubmit={handleAddPlaceSubmit}
                  onNewPlaceCaptionChange={handleNewPlaceCaptionChange}
                  onNewPlaceChange={handleNewPlaceChange}
                  newPlace={newPlace}
                  newPlaceCaption={newPlaceCaption}
                  setNewPlace={setNewPlace}
                  setNewPlaceCaption={setNewPlaceCaption}
                  name={userName}
                  about={userDescription}
                />

                <PopupWithForm
                  title="¿Estás seguro?"
                  submitText="Sí"
                  isOpen={popupEraseCard}
                  onClose={closeAllPopups}
                  inputs={[]}
                />

                <ImagePopup
                  isOpen={popupPic}
                  onClose={closeAllPopups}
                  imagePopup={selectedCard}
                />
                <Main
                  onEditAvatarClick={handleEditAvatarClick}
                  onAddPlaceClick={handleAddPlaceClick}
                  onCardClick={handleCardClick}
                  onEditProfileClick={handleEditProfileClick}
                  renderCards={renderCards}
                />
                <Footer />
              </div>
            </ProtectedRoute>
          }
        />
      </Routes>
    </CurrentUserContext.Provider>
  );
}
