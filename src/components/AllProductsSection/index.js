import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'

import FiltersGroup from '../FiltersGroup'
import ProductCard from '../ProductCard'
import ProductsHeader from '../ProductsHeader'

import './index.css'

const categoryOptions = [
  {
    name: 'Clothing',
    categoryId: '1',
  },
  {
    name: 'Electronics',
    categoryId: '2',
  },
  {
    name: 'Appliances',
    categoryId: '3',
  },
  {
    name: 'Grocery',
    categoryId: '4',
  },
  {
    name: 'Toys',
    categoryId: '5',
  },
]

const sortbyOptions = [
  {
    optionId: 'PRICE_HIGH',
    displayText: 'Price (High-Low)',
  },
  {
    optionId: 'PRICE_LOW',
    displayText: 'Price (Low-High)',
  },
]

const ratingsList = [
  {
    ratingId: '4',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-four-stars-img.png',
  },
  {
    ratingId: '3',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-three-stars-img.png',
  },
  {
    ratingId: '2',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-two-stars-img.png',
  },
  {
    ratingId: '1',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-one-star-img.png',
  },
]

class AllProductsSection extends Component {
  state = {
    productsList: [],
    isLoading: false,
    activeOptionId: sortbyOptions[0].optionId,
    titleSearch: '',
    category: '',
    rating: '',
    apiStatus: 'SUCCESS', // Added to manage failure status
  }

  componentDidMount() {
    this.getProducts()
  }

  // Handling search input
  onSearchInputChange = value => {
    this.setState({titleSearch: value}, this.getProducts)
  }

  // Handling category change
  changeCategory = id => {
    const activeCategory = categoryOptions.find(
      options => options.categoryId === id,
    ).name
    this.setState({category: activeCategory}, this.getProducts)
  }

  // Handling rating change
  changerating = id => {
    this.setState({rating: id}, this.getProducts)
  }

  // Fetch products with applied filters
  getProducts = async () => {
    this.setState({isLoading: true})
    const jwtToken = Cookies.get('jwt_token')

    const {activeOptionId, titleSearch, category, rating} = this.state
    const apiUrl = `https://apis.ccbp.in/products?sort_by=${activeOptionId}&title_search=${titleSearch}&category=${category}&rating=${rating}`

    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }

    try {
      const response = await fetch(apiUrl, options)
      if (response.ok) {
        const fetchedData = await response.json()
        if (fetchedData.products.length === 0) {
          this.setState({productsList: [], isLoading: false})
        } else {
          const updatedData = fetchedData.products.map(product => ({
            title: product.title,
            brand: product.brand,
            price: product.price,
            id: product.id,
            imageUrl: product.image_url,
            rating: product.rating,
          }))
          this.setState({
            productsList: updatedData,
            isLoading: false,
            apiStatus: 'SUCCESS',
          })
        }
      } else {
        this.setState({isLoading: false, apiStatus: 'FAILURE'})
      }
    } catch (error) {
      this.setState({isLoading: false, apiStatus: 'FAILURE'})
    }
  }

  // Handling sort by change
  changeSortby = activeOptionId => {
    this.setState({activeOptionId}, this.getProducts)
  }

  // Handling clear filters
  clearFilters = () => {
    this.setState(
      {
        title_search: '',
        category: '',
        rating: '',
        activeOptionId: sortbyOptions[0].optionId,
      },
      this.getProducts,
    )
  }

  // Rendering loader
  renderLoader = () => (
    <div className="products-loader-container">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  // Rendering failure view
  renderFailureView = () => (
    <div className="failure-view">
      <h1>Something went wrong</h1>
      <button type="button" onClick={this.getProducts}>
        Retry
      </button>
    </div>
  )

  // Rendering no products view
  renderNoProductsView = () => (
    <div className="no-products-view">
      <h1>No Products Found</h1>
    </div>
  )

  // Rendering products list
  renderProductsList = () => {
    const {productsList} = this.state

    if (productsList.length === 0) {
      return this.renderNoProductsView()
    }

    return (
      <ul className="products-list">
        {productsList.map(product => (
          <ProductCard productData={product} key={product.id} />
        ))}
      </ul>
    )
  }

  // Render method
  render() {
    const {isLoading, apiStatus} = this.state

    if (apiStatus === 'FAILURE') {
      return this.renderFailureView()
    }

    return (
      <div className="all-products-section">
        <FiltersGroup
          categoryOptions={categoryOptions}
          ratingsList={ratingsList}
          changeCategory={this.changeCategory}
          changerating={this.changerating}
          onSearchInputChange={this.onSearchInputChange} // Pass to child component
          clearFilters={this.clearFilters} // Pass clear filters function
        />

        {isLoading ? this.renderLoader() : this.renderProductsList()}
      </div>
    )
  }
}

export default AllProductsSection
