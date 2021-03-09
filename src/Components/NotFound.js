import React from 'react';

const NotFoundPage = (props) => {
  return (
    <div>
      <h2>404 - Page not found</h2>
      <p>How did you even get here? That's not supposed to happen.</p> 
    </div>
  );
}

NotFoundPage.defaultProps = {
  history: {
    push: () => {},
  },
}

export default NotFoundPage;