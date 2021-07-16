import React from 'react';

const NotFoundPage = (props) => {
  return (
    <div>
      <h2>404 - Page not found</h2>
      <p>Some wild magic sent you to a page that does not exist! That's not supposed to happen...</p> 
    </div>
  );
}

NotFoundPage.defaultProps = {
  history: {
    push: () => {},
  },
}

export default NotFoundPage;