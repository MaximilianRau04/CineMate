import { MediaCard as TicketCard } from "../explore/MediaCard";

/**
 * Poster card used in profile tabs and lists. Reuses the ticket-style card
 * from the explore page so media looks the same everywhere.
 */
const MediaCard = ({ media, type }) => {
  if (!media) return null;

  const item = {
    ...media,
    genreArray:
      media.genreArray || (media.genre ? media.genre.split(/,\s*/) : []),
  };

  return <TicketCard item={item} type={type} />;
};

export default MediaCard;
