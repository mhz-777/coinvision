import './Navigation.css';

interface navigationProps {

    siteSection: boolean;
    handleChange: () => void;

}


const Navigation: React.FC<navigationProps> = ({siteSection, handleChange}) => {




    return (
        <div className="nav-container">
            <nav className="wowzers">
                <button className="toggle-site-section-btn" id='navigation-search' onClick={handleChange}>Click</button>
                <button className="toggle-site-section-btn" id='navigation-home' onClick={handleChange}>Click</button>
                <button className="toggle-site-section-btn" id='navigation-favorites' onClick={handleChange}>Click</button>
            </nav>
          
        </div>
    );
}

export default Navigation;