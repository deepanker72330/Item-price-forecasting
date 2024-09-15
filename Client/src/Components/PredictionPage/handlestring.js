import React from 'react';

const handlestring = ({ min }) => {
    const goodstr = "You should buy the product now !";
    const badstr = `You should wait for approximately ${min} days `;
    if (min == 0) {
        return <div> {goodstr}</div >;
    }
    else {
        return badstr;
    }
}

export default handlestring;