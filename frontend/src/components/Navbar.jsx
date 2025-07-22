import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold text-gray-800">FormManager</span>
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link
              to="/"
              className={`px-3 py-2 rounded-md text-sm font-medium transition duration-150 ease-in-out ${
                isActive('/') 
                  ? 'text-blue-700 bg-blue-100' 
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
              }`}
            >
              Inicio
            </Link>
            <Link
              to="/form"
              className={`px-3 py-2 rounded-md text-sm font-medium transition duration-150 ease-in-out ${
                isActive('/form') 
                  ? 'text-blue-700 bg-blue-100' 
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
              }`}
            >
              Crear Formulario
            </Link>
            <Link
              to="/list"
              className={`px-3 py-2 rounded-md text-sm font-medium transition duration-150 ease-in-out ${
                isActive('/list') 
                  ? 'text-blue-700 bg-blue-100' 
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
              }`}
            >
              Ver Formularios
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
