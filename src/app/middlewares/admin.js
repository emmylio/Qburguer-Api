const adminMiddleware = (request, response, next) => {
  const isUseradmin = request.userIsAdmin;

  if (!isUseradmin) {
    return response.status(401).json();
  }

 
  return next(); 
};

export default adminMiddleware;