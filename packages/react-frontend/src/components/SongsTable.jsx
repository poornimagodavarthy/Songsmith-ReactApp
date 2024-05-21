import "./SongsTable.css";
import React from "react";

function TableHeader() {
  return (
    <thead>
      <tr>
        <th>#</th>
        <th>Album Image</th>
        <th>Track Name</th>
        <th>Artist Name</th>
        <th>Album Name</th>
        <th>Track Duration</th>
      </tr>
    </thead>
  );
}

function convertMins(mins) {
  const message = `${Math.floor(mins / 1)} mins ${Math.floor(
    (mins % 1) * 60
  )} secs`;
  return message;
}
function TableBody(props) {
  if (!props || !Array.isArray(props.songData)) {
    return <tbody></tbody>;
  }
  const rows = props.songData.map((row, index) => {
    return (
      <tr key={index}>
        <td>{1 + index}</td>
        <td>
          <img
            src={row.image_link}
            alt="Album Image"
            style={{ width: "100px", height: "100px" }}
          />
        </td>
        <td className> {row.name}</td>
        <td>{row.artist}</td>
        <td>{row.album}</td>
        <td>{convertMins(row.duration)}</td>
      </tr>
    );
  });
  return <tbody>{rows}</tbody>;
}

function Table(props) {
  return (
    <>
      <div className="header-container">
        <h1 className="song-header">Songs</h1>
        <button onClick={props.handleButtonClick} className="navigate-button">
          Add Song
        </button>
      </div>
      <table className="song-table">
        <TableHeader />
        <TableBody songData={props.songData} />
      </table>
    </>
  );
}

export default Table;
