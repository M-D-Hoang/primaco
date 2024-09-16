import React from 'react';
import 'react-select-search/style.css'

//display timestamp
function TimeStamp({ timestamp, timezone, note }) {
    return (
        <div className="timestamp">
            <p> Note: {note}</p>
            <div className='column'>
                <p>{timestamp}</p>
                <p>{timezone}</p>
            </div>
        </div>
    );
}

export default TimeStamp;