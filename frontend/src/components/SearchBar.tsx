import { Box, TextField } from "@mui/material";
import { useState } from "react";

export const SearchBar = ({
  onSubmit,
  value = "",
}: {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  value?: string;
}) => {
  const [query, setQuery] = useState(value);

  return (
    <Box
      component="form"
      sx={{
        display: "flex",
        mt: 4,
      }}
      onSubmit={onSubmit}
    >
      <TextField
        fullWidth
        type="text"
        name="search"
        variant="outlined"
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search for a user or artist"
        value={query}
      />
    </Box>
  );
};
