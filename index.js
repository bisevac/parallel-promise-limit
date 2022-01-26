module.exports = function parallelPromiseLimit ( promiseArray, _limit = 5 ) {
  return new Promise( ( resolve, reject ) => {
    const limit = _limit < promiseArray.length ? _limit : promiseArray.length;
    const resultArray = [];
    let resultCount = 0;
    let queue = 0;

    promiseArray.forEach( ( test ) => {
      if ( !( typeof test === 'function' ) ) {
        return reject( new Error( 'non-function variable' ) );
      }
    } );

    function onResolve ( res, l ) {
      resultArray[ l ] = res;
      resultCount += 1;

      if ( queue < promiseArray.length ) {
        return run( queue );
      }

      if ( resultCount === promiseArray.length ) {
        return resolve( resultArray );
      }
    }

    function onReject ( e ) {
      return reject( e );
    }

    function run ( order ) {
      const prr = promiseArray[ order ];

      if ( prr ) {
        prr().then( result => onResolve( result, order ) ).catch( onReject );
      }

      queue += 1;
    }


    for ( let i = 0; i < limit; i += 1 ) {
      run( queue );
    }
  } );
};
