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

   

    return (
        <div className="settings-overlay">
            <section className="settings">
                <h3 className="settings-header">Theme</h3>
                <label htmlFor="theme" className="theme-toggle">
                    <input type="checkbox" name="theme" id="theme" />
                    <span className="theme-slider"></span>
                </label>
                <div className="theme-selection-text-container">
                    <p className="theme-choice">light</p>
                    <p className="theme-choice">dark</p>
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
                        <ul className="currency-labels">Cad</ul>
                        <ul className="currency-labels">Usd</ul>
                        <ul className="currency-labels">Aud</ul>
                        <ul className="currency-labels">Jpy</ul>
                    </div>
                </section>
                <button className="settings-escape-btn" onClick={()=> setClicked(false)}>X</button>
            </section>
        </div>
    );
} 

export default Settings;