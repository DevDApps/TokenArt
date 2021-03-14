import React, { Component } from 'react';
import Identicon from 'identicon.js';

class Main extends Component {

  render() {
    return (

      <div className="container-fluid mt-5">
        <div className="row">
          <main role="main" className="col-lg-12 ml-auto mr-auto" style={{ maxWidth: '600px' }}>
            <div className="content mr-auto ml-auto">
              <p>&nbsp;</p>

              <h2>Mint an NFT</h2>
              <form onSubmit={(event) => {
                event.preventDefault()
                const price = this.priceInput.value
                this.props.uploadImage(price)
              }} >
                <input type='file' accept=".jpg, .jpeg, .png, .bmp, .gif" onChange={this.props.captureFile} />
                  <div className="form-group mr-sm-2">
                    <br></br>
                      <input
                        id="priceInput"
                        type="text"
                        ref={(input) => { this.priceInput = input }}
                        className="form-control"
                        placeholder="Enter price in Eth ..."
                        required />
                  </div>
                <button type="submit" className="btn btn-primary btn-block btn-lg">Upload</button>
              </form>


              <hr />
              <p>&nbsp;</p>
              <label>Search by Owner: </label>
              <input
                  type="submit"
                  id="SearchOwner"
                  type="text"
                  ref={(input) => { this.userSearchFilter = input }}
                  className="form-control"
                  placeholder="0xC60124F569A7F59C852f82E5bC13a508e4513Be1 ..."
                  onChange={ this.props.getValueInput } />

              <p>&nbsp;</p>

              { this.props.images.map((image, key) => {
                return(

                <div className="card mb-5" key={key} >
                    <div className="card-header">
                      <img
                        className='mx-2'
                        width='30'
                        height='30'
                        src={`data:image/png;base64,${new Identicon(image.owner, 30).toString()}`}
                      />
                      <small className="text-muted">{image.owner}</small>
                    </div>

                    <ul id="imageList" className="list-group list-group-flush">
                      <li className="list-group-item">
                        <p className="text-center">
                            <img  src={`https://ipfs.infura.io/ipfs/${image.hash}`} width="65%"   />
                        </p>


                        <div className="row justify-content-center">

                           <h4 className="col-5">#{image.id}
                               &nbsp; &nbsp;
                               <button
                                     className="btn btn-success"
                                     name={image.id}
                                     onClick={(event) => {
                                       let toWeiPrice = window.web3.utils.toWei( image.price, 'Ether')
                                       console.log(event.target.name, toWeiPrice)
                                       this.props.buyNFT(event.target.name, toWeiPrice)
                                 }} >
                                      Buy for {image.price} Eth
                                </button>

                            </h4>
                        </div>
                      </li>
                    </ul>
                  </div>
                )
              })}

            </div>
          </main>
        </div>
      </div>
    );
  }
}

export default Main;
