import './index.css'

const FiltersGroup = props => {
  const {
    categoryOptions,
    ratingsList,
    changeCategory,
    changerating,
    onSearchInputChange,
    clearFilters,
  } = props

  // Handle search input change
  const onChangeSearch = event => {
    onSearchInputChange(event.target.value)
  }

  const onClickCategory = id => {
    changeCategory(id) // Trigger category change
  }

  const onClickRating = id => {
    changerating(id) // Trigger rating change
  }

  return (
    <div className="filters-group-container">
      <h1>Filters Group</h1>
      <div className="searchContainer">
        <input
          type="search"
          className="search"
          placeholder="Search"
          onChange={onChangeSearch} // Trigger onChange for search
        />
      </div>
      <h1>Category</h1>
      <ul>
        {categoryOptions.map(each => (
          <li key={each.categoryId}>
            <p onClick={() => onClickCategory(each.categoryId)}>{each.name}</p>
          </li>
        ))}
      </ul>
      <p>Rating</p>
      <ul>
        {ratingsList.map(eachRating => (
          <li className="ratingListItem" key={eachRating.ratingId}>
            <button
              type="button"
              className="CategoryButton"
              onClick={() => onClickRating(eachRating.ratingId)}
            >
              <img
                src={eachRating.imageUrl}
                alt={`rating ${eachRating.ratingId}`}
                className="ratingImage"
              />
              <p>&up</p>
            </button>
          </li>
        ))}
      </ul>
      <button type="button" className="filtersClearBtn" onClick={clearFilters}>
        Clear Filters
      </button>
    </div>
  )
}

export default FiltersGroup
