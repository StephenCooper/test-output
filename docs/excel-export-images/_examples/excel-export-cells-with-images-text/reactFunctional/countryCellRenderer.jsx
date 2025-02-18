import React from 'react';

export default ({ data, context }) => (<React.Fragment>
        <img alt={data.country} src={context.base64flags[context.countryCodes[data.country]]}/> {data.country}
    </React.Fragment>);

