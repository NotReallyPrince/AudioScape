import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Song {
  id: string;
  title: string;
  artist: string;
  thumbnail: string;
  url?: string;
  duration?: number;
}

interface LibraryState {
  favoriteTracks: Song[];
  playlists: Record<string, Song[]>;
}

const initialState: LibraryState = {
  favoriteTracks: [],
  playlists: {},
};

const librarySlice = createSlice({
  name: "library",
  initialState,
  reducers: {
    toggleFavorite: (state, action: PayloadAction<Song>) => {
      const trackInfo = action.payload;
      const index = state.favoriteTracks.findIndex(
        (track) => track.id === trackInfo.id
      );
      if (index !== -1) {
        state.favoriteTracks.splice(index, 1);
      } else {
        state.favoriteTracks.push(trackInfo);
      }
    },
    addToPlaylist: (
      state,
      action: PayloadAction<{ track: Song; playlistName: string }>
    ) => {
      const { track, playlistName } = action.payload;
      if (!state.playlists[playlistName]) {
        state.playlists[playlistName] = [];
      }
      if (!state.playlists[playlistName].some((t) => t.id === track.id)) {
        state.playlists[playlistName].push(track);
      }
    },
  },
});

export const { toggleFavorite, addToPlaylist } = librarySlice.actions;
export default librarySlice.reducer;