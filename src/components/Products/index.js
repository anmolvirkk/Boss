import React, { Component } from 'react'
import './products.css'
import ProductTile from '../ProductTile'
import axios from 'axios'

export default class Products extends Component {
    constructor(props) {
		super(props);
        this.handleColorAPI = this.handleColorAPI.bind(this);
        this.handlePriceAPI = this.handlePriceAPI.bind(this);
        this.hideError = this.hideError.bind(this);
		this.state = {
			categories: [],
			products: [],
            filteredProducts: [],
            error: ''
		}
	}

    hideError() {
            this.setState({error: ''});
    }

    handleColorAPI(e) {
        var newProductList = [];
        for(var i = 0; i<this.state.products.length; i++){
            if(this.state.products[i].name.includes(e.target.className)){
                newProductList.push(this.state.products[i]);
            }
        }
        this.setState({filteredProducts: newProductList, error: ''});
        if(newProductList.length === 0){
            this.setState({error: `We're out of ${e.target.className} colored products.`});
        }
    }

    handlePriceAPI(e) {
        var newProductList = [];
        for(var j = 0; j < e.target.parentNode.children.length; j++){
            e.target.parentNode.children[j].style['background-color'] = 'white';
            e.target.parentNode.children[j].style['color'] = 'black';
        }
        e.target.style['background-color'] = 'black';
        e.target.style['color'] = 'white';
        for(var i = 0; i<this.state.products.length; i++){
            if(e.target.dataset.max === '0'){
                if(this.state.products[i].price.current.value >= e.target.dataset.min){
                    newProductList.push(this.state.products[i]);
                }
            }else{
                if(this.state.products[i].price.current.value >= e.target.dataset.min && this.state.products[i].price.current.value <= e.target.dataset.max){
                    newProductList.push(this.state.products[i]);
                }
            }
        }
        this.setState({filteredProducts: newProductList, error: ''});
        if(newProductList.length === 0){
            this.setState({error: `products ${e.target.firstChild.nodeValue} not available`});
        }
    }

    componentDidMount() {
        var categoryOptions = {
            method: 'GET',
            url: 'https://asos2.p.rapidapi.com/categories/list',
            params: {country: 'US', lang: 'en-US'},
            headers: {
              'x-rapidapi-key': 'd3d74f2a27mshd54a048de877ce3p15d9edjsndede7d4e9632',
              'x-rapidapi-host': 'asos2.p.rapidapi.com'
            }
          };
          let thisRef = this;
          axios.request(categoryOptions).then(function (response) {
            thisRef.setState({ categories: response.data.navigation[0].children[4].children });
          }).catch(function (error) {
              console.error(error);
          });
        var options = {
            method: 'GET',
            url: 'https://asos2.p.rapidapi.com/products/v2/list',
            params: {
              offset: '0',
              categoryId: '4209',
              limit: '48',
              store: 'US',
              country: 'US',
              currency: 'USD',
              sort: 'freshness',
              lang: 'en-US',
              sizeSchema: 'US'
            },
            headers: {
              'x-rapidapi-key': 'd3d74f2a27mshd54a048de877ce3p15d9edjsndede7d4e9632',
              'x-rapidapi-host': 'asos2.p.rapidapi.com'
            }
          };
          axios.request(options).then(function (response) {
            thisRef.setState({ products: response.data.products });
          }).catch(function (error) {
              console.error(error);
          });
    }
    render() {
        let errorStyle = {
            display: 'none'
        }
        if(this.state.error !== ''){
            errorStyle = {
                display: 'flex'
            }
        }else {
            errorStyle = {
                display: 'none'
            }
        }
        return (    
            <>
            
            <ul className = 'category'>
                { this.state.categories.map(category => <li key={category.id}>{category.content.title}</li>) }
            </ul>

        <div style={{display: 'flex'}}>
            <div className="filter">
            <h2 className="filterTitle">
                <p>Filters</p>
                <hr />
            </h2>
            <div className = "filters">
                <ul>
                    <li>
                        <p>Colors</p>
                        <ol className = "colors">
                            <li onClick={this.handleColorAPI} className="black"></li>
                            <li onClick={this.handleColorAPI} className="white"></li>
                            <li onClick={this.handleColorAPI} className="gray"></li>
                            <li onClick={this.handleColorAPI} className="brown"></li>
                            <li onClick={this.handleColorAPI} className="red"></li>
                            <li onClick={this.handleColorAPI} className="pink"></li>
                            <li onClick={this.handleColorAPI} className="green"></li>
                            <li onClick={this.handleColorAPI} className="blue"></li>
                            <li onClick={this.handleColorAPI} className="navy"></li>
                        </ol>
                    </li>
                    <li>
                        <p>Price</p>
                        <ol className = "prices">
                                <li onClick={this.handlePriceAPI} data-min='0' data-max='0'>All</li>
                                <li onClick={this.handlePriceAPI} data-min='0' data-max='20'>{"<$20"}</li>
                                <li onClick={this.handlePriceAPI} data-min='20' data-max='50'>$20 - $50</li>
                                <li onClick={this.handlePriceAPI} data-min='50' data-max='100'>$50 - $100</li>
                                <li onClick={this.handlePriceAPI} data-min='100' data-max='250'>$100 - $250</li>
                                <li onClick={this.handlePriceAPI} data-min='250' data-max='0'>{">$250"}</li>
                        </ol>
                    </li>
                </ul>
            </div>
            </div>
        <div className="productList">
        { this.state.filteredProducts.length > 0 ? this.state.filteredProducts.map(product => <ProductTile name={product.name} category={product.brandName} price={product.price.current.text} img={"https://"+product.imageUrl} key={product.id} />) : this.state.products.map(product => <ProductTile name={product.name} category={product.brandName} price={product.price.current.text} img={"https://"+product.imageUrl} key={product.id} />) }
        </div>
        <div className="error" style={errorStyle}>
            <lottie-player src="https://assets6.lottiefiles.com/packages/lf20_sfktyrws.json" loop autoplay></lottie-player>
            <h1>Oh No!</h1>
            <p>{this.state.error}</p>
            <button onClick={this.hideError}>Try Again</button>
        </div>
        </div>
        </>
        )
    }
}