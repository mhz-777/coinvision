import './Navigation.css';

interface navigationProps {

    siteSection: boolean;
    handleChange: () => void;

}


const Navigation: React.FC<navigationProps> = ({siteSection, handleChange}) => {




    return (
        <div className="toggle-nav-container">
          <button className="toggle-site-section-btn" onClick={handleChange}>Click</button>
        </div>
    );
}

export default Navigation;