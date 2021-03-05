import React, { Component } from 'react';

export default class notFound extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount(){
    
  }

  render() {
    return (
      <>
        <div class="container text-center">
            <img src="https://cdn.dribbble.com/users/19381/screenshots/3304316/404-animated-console-600h.gif" width="50%" class="rounded mx-auto d-block" alt="..." />
            <h1>Page Not Found</h1>
            <p>
                the link you followd may be broken, or the page may have been removed.
            </p>
        </div>
      </>
    );
  }
}
