import { useState, useEffect, useCallback } from "react";
import "./Playlist.css";
import { useLocation } from "react-router-dom";
import SongsTable from "../components/SongsTable";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import {faThumbsUp, faThumbsDown,faComment} from "@fortawesome/free-solid-svg-icons";
import PropTypes from 'prop-types'; // Import PropTypes
import EditPlaylist from "../components/EditPlaylist"
import Comments from "../components/Comments"

function Playlist({userId}) {
  const location = useLocation();
  const path = location.pathname.split("/")[2];
  const [playlist, setPlaylist] = useState({});
  const [showComments, setShowComments] = useState(false);
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);
  const [showEdit, setShowEdit] = useState(false);
  const [authorUsername, setAuthorUsername] = useState("");

  const fetchPlaylist = useCallback(() => {
    return fetch("https://songsmith.azurewebsites.net/playlists/" + path)
      .then((res) => res.json())
      .then((json) => {
        setPlaylist(json["playlist_list"]);
        return json["playlist_list"];
      });
  }, [path]);

  useEffect(() => {
    fetchPlaylist()
      .then((playlistData) => {
        if (playlistData && playlistData["author"]) {
          return fetch("http://localhost:8000/users/" + playlistData["author"], {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          });
        }
        return Promise.reject("No author found");
      })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch user");
        }
        return response.json();
      })
      .then((user) => {
        setAuthorUsername(user["username"]);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, [fetchPlaylist]);

  const handleLike = () => {
    setLikes(likes + 1);
  };

  const handleDislike = () => {
    setDislikes(dislikes + 1);
  };

  const toggleEdit = () => {
    setShowEdit(!showEdit);
  };

  function AddSong() {
    const [song, setSong] = useState("");

    const handleInputChange = (event) => {
      setSong(event.target.value);
    };

    const handleAddSong = () => {
      console.log('Adding song:', song);

      fetch("https://songsmith.azurewebsites.net/playlists/" + path, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: song }),
      })
        .then(response => response.json())
        .then(data => {
          console.log('Success:', data);
          fetchPlaylist()
            .then(res => res.json())
            .then(json => {
              setPlaylist(json["playlist_list"]);
            })
            .catch(error => {
              console.log(error);
            });
        })
        .catch((error) => {
          console.error("Error:", error);
        });

      setSong("");
    };

    return (
      <div className="pl-add-song">
        <input
          placeholder="Song"
          className="pl-song-input"
          value={song}
          onChange={handleInputChange}
        />
        <button onClick={handleAddSong} className="pl-song-button">
          Add Song
        </button>
      </div>
    );
  }

  const toggleComments = () => {
    setShowComments(!showComments);
  };

  return (
    <div className="playlist">
      <div className="pl-top">
        <div className="pl-image">
          <img
            src={
              playlist.cover
                ? playlist.cover
                : "https://images.rawpixel.com/image_800/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDIzLTEyL2xyL21vbnoxNzU2NjItaW1hZ2UuanBn.jpg"
            }
            alt="Playlist Image"
          />
        </div>
        <div className="pl-info">
          <div className="pl-name">{playlist["playlist_name"]}</div>
          <div className="pl-author">{authorUsername}</div>
          <div className="pl-desc">{playlist["description"]}</div>
          <div className="pl-toolbar">
            <div className="pl-buttons">
              <button onClick={handleLike}>
                Likes: {likes}
              </button>
              <button onClick={handleDislike}>
                Dislikes: {dislikes}
              </button>
              <button
                onClick={toggleComments}
                style={{ cursor: "pointer" }}>
                Comments
              </button>

              {playlist["author"] === userId && 
                <button onClick={toggleEdit} className="pl-edit-button">
                Edit Playlist
                </button>}
              
            </div>
          </div>
          {playlist["author"] === userId && <AddSong />}
        </div>
        {showEdit && (
          <EditPlaylist
            playlist={playlist}
            onClose={() => setShowEdit(false)}
          />
        )}
      </div>

      <div className="pl-table">
        {showComments ? (
          <Comments comments={playlist["comments"]} />
        ) : (
          <SongsTable songData={playlist["songs"]} />
        )}
      </div>
    </div>
  );
}

export default Playlist;
