import './Settings.css';



interface settingsProps {

    theme: boolean;
    setTheme: (value: boolean) => void;


    currency: number;
    setCurrency: (value: number) => void;

    isClicked: boolean;
    setClicked: (value: boolean) => void;
}

const Settings: React.FC<settingsProps> = ({theme, setTheme, currency, setCurrency, isClicked, setClicked}) => {

    const toggleTheme = () => {
        setTheme(!theme);
    }

    return (
        <div className="settings-overlay">
            <section className="settings">
                <h3 className="settings-header">Theme</h3>
                <label htmlFor="theme" className="theme-toggle">
                    <input type="checkbox" name="theme" id="theme" checked={!theme} onChange={toggleTheme}/>
                    <span className="theme-slider"></span>
                </label>
                <div className="theme-selection-text-container">
                    <p className={`theme-choice ${theme ? '' : 'toggle-text-disabled'}`}>light</p>
                    <p className={`theme-choice ${theme ? 'toggle-text-disabled' : ''}`}>dark</p>
                </div>
                <h3 className="settings-header">Currency</h3>
                <section className="currency-selection-container">
                    <div className="slider-container">
                        <input 
                            type="range"
                            className='original-slider'
                            id='custom-range'
                            min={0}
                            max={3}
                            value={currency}
                            onChange={(event) => setCurrency(Number(event.target.value))}
                        />
                    </div> 
                    <div className="currency-selection-labels-container">
                        <ul className={`currency-labels ${currency != 3 ? 'toggle-text-disabled' : ''}`}>Cad</ul>
                        <ul className={`currency-labels ${currency != 2 ? 'toggle-text-disabled' : ''}`}>Usd</ul>
                        <ul className={`currency-labels ${currency != 1 ? 'toggle-text-disabled' : ''}`}>Aud</ul>
                        <ul className={`currency-labels ${currency != 0 ? 'toggle-text-disabled' : ''}`}>Jpy</ul>
                    </div>
                </section>
                <button className="settings-escape-btn" onClick={()=> setClicked(false)}>X</button>
            </section>
        </div>
    );
} 

export default Settings;