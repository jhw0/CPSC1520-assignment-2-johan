/* 
<tr>
  <td>ALBUM NAME HERE</td>
  <td>RELEASE DATE HERE</td>
  <td>ARTIST NAME HERE</td>
  <td>GENRE HERE</td>
  <td>AVERAGE RATING HERE</td>
  <td>NUMBER OF RATINGS HERE</td>
</tr> 
*/
let albumStore = [];
let filteredAlbums = []
let sortReleaseDateAscending = true;
let sortAverageRatingAscending = true;

//submit event listener for album search form
document.getElementById('album-search-form').addEventListener('submit', function(event)
{
  event.preventDefault();
  const searchQuery = document.getElementById('search-input').value.trim().toLowerCase();
  const minRating = parseFloat(document.getElementById('min-album-rating-input').value);
  const searchResults = searchAlbumsByArtist(searchQuery, albumStore);
  filteredAlbums = filterAlbumsByRating(minRating, searchResults);
  displayAlbums(filteredAlbums);
});

// Event listener for sorting by release date
document.getElementById('release-date-header').addEventListener('click', () => 
{
  sortAlbumsByReleaseDate(filteredAlbums, sortReleaseDateAscending);
  sortReleaseDateAscending = !sortReleaseDateAscending;
  updateSortIndicator('release-date-header', sortReleaseDateAscending);
  displayAlbums(filteredAlbums);
});

// Event listener for sorting by average rating
document.getElementById('average-rating-header').addEventListener('click', () => 
{
  sortAlbumsByAverageRating(filteredAlbums, sortAverageRatingAscending);
  sortAverageRatingAscending = !sortAverageRatingAscending; 
  updateSortIndicator('average-rating-header', sortAverageRatingAscending);
  displayAlbums(filteredAlbums);
});

//search for albums by artist name
function searchAlbumsByArtist(query, albums)
{
  if(!query)
  {
    return albums;
  }

  return albums.filter(album => 
    {
      return album.album.toLowerCase().includes(query) || album.artistName.toLowerCase().includes(query);
    }
  );
}

//filter albums by rating
function filterAlbumsByRating(minRating, albums)
{
  if(isNaN(minRating) || minRating <= 0)
  {
    return albums;
  }

  return albums.filter(album => 
    {
      return album.averageRating >= minRating;
    });
}


//fetch and display album data
async function fetchAlbumData()
{
  try{
    const response = await fetch('public/data/albums.json');
    if(!response.ok)
    {
      throw new Error('Album data not found');
    }
    const albums = await response.json();
    albumStore = albums;
    filteredAlbums = albums;
    displayAlbums(filteredAlbums);
  }
  catch(error)
  {
    console.error('Error fetchinig album data:', error);
  }
}

//display album data in table
function displayAlbums(albums)
{
  const albumRows = document.getElementById('album-rows');
  albumRows.innerHTML = '';

  albums.forEach(album => {
    const row = `
      <tr>
        <td>${album.album}</td>
        <td>${album.releaseDate}</td>
        <td>${album.artistName}</td>
        <td>${album.genres}</td>
        <td>${album.averageRating}</td>
        <td>${album.numberReviews}</td>
      </tr>
    `;
    albumRows.innerHTML += row;
  });
}

// Function to sort albums by release date
function sortAlbumsByReleaseDate(albums, ascending) 
{
  albums.sort((a, b) => 
  {
    const dateA = new Date(a.releaseDate);
    const dateB = new Date(b.releaseDate);
    return ascending ? dateA - dateB : dateB - dateA;
  });
}

// Function to sort albums by average rating
function sortAlbumsByAverageRating(albums, ascending) 
{
  albums.sort((a, b) => 
  {
    return ascending ? a.averageRating - b.averageRating : b.averageRating - a.averageRating;
  });
}

// Function to update the sort indicator
function updateSortIndicator(headerId, ascending) 
{
  const header = document.getElementById(headerId);
  document.querySelectorAll('.sort-indicator').forEach(indicator => 
    {
    indicator.classList.remove('sort-asc', 'sort-desc');
    });

  header.classList.add(ascending ? 'sort-asc' : 'sort-desc');
}


window.addEventListener('DOMContentLoaded', fetchAlbumData);