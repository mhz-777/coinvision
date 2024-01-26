import './Navigation.css';

interface navigationProps {

    onSiteSectionChange: (navChoice: string) => void;

}


const Navigation: React.FC<navigationProps> = ({onSiteSectionChange}) => {

    // function to handle site section changes
    const handleChange = (navChoice: string) => {
        onSiteSectionChange(navChoice);
    }


    return (
        <div className="nav-container">
            <nav className="nav-options">
                <button className="toggle-site-section-btn" id='navigation-search' onClick={ () => handleChange('search')}>Click</button>
                <button className="toggle-site-section-btn" id='navigation-home' onClick={ () => handleChange('landing')}>Click</button>
                <button className="toggle-site-section-btn" id='navigation-favorites' onClick={() => handleChange('favorites')}>Click</button>
            </nav>
          
        </div>
    );
}

export default Navigation;