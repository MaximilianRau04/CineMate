import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export const useMediaDetail = (mediaType = 'movies') => {
  const { id: mediaId } = useParams();
  const [media, setMedia] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [actors, setActors] = useState([]);
  const [director, setDirector] = useState(null);
  const [castLoading, setCastLoading] = useState(true);

  // Load current user
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    fetch("http://localhost:8080/api/users/me", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.ok ? res.json() : Promise.reject(`HTTP Error: ${res.status}`))
      .then((data) => {
        if (data?.id) {
          setUserId(data.id);
          setCurrentUser(data);
        }
      })
      .catch((err) => console.error("Fehler beim Laden des Users:", err));
  }, []);

  // Load media details
  useEffect(() => {
    if (!mediaId) return;

    setIsLoading(true);
    setError(null);

    fetch(`http://localhost:8080/api/${mediaType}/${mediaId}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(
            res.status === 404 
              ? `${mediaType === 'movies' ? 'Film' : 'Serie'} wurde nicht gefunden`
              : `${mediaType === 'movies' ? 'Film' : 'Serie'} konnte nicht geladen werden (${res.status})`
          );
        }
        return res.json();
      })
      .then((data) => {
        setMedia(data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error(`Fehler beim Laden des ${mediaType}:`, err);
        setError(err.message);
        setIsLoading(false);
      });
  }, [mediaId, mediaType]);

  // Load cast and crew
  useEffect(() => {
    if (!mediaId) return;

    setCastLoading(true);

    const fetchActors = fetch(`http://localhost:8080/api/${mediaType}/${mediaId}/actors`)
      .then((res) => res.ok ? res.json() : [])
      .catch(() => []);

    const fetchDirector = fetch(`http://localhost:8080/api/${mediaType}/${mediaId}/director`)
      .then((res) => res.ok ? res.json() : null)
      .catch(() => null);

    Promise.all([fetchActors, fetchDirector])
      .then(([actorsData, directorData]) => {
        setActors(actorsData || []);
        setDirector(directorData);
        setCastLoading(false);
      });
  }, [mediaId, mediaType]);

  return {
    mediaId,
    media,
    setMedia,
    isLoading,
    error,
    userId,
    currentUser,
    actors,
    director,
    castLoading
  };
};