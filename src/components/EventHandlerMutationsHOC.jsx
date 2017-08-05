const handleBlurMutationsHOC = (WrappedComponent, createMutation, updateMutation, stateChildrenArray, columnsArray) => {
	return class handleBlur extends React.Component {
		constructor(props){
			super(props);
			let newState = {};
			columnsArray.map((current)=>{
				newState[current] = this.props[current];
			});
			this.state = newState;
			this.handleBlur = this.handleBlur.bind(this)
		}
		handleBlur(){
		  cachedJobQuery = client.readQuery({
		    query: GetJobQuery,
		    variables: {
		      id: this.props.job.id
		    }
		  });

		  console.log('cached job query is: ', cachedJobQuery);

		  if(!cachedJobQuery.job.address) {
		    client.mutate({
		      mutation: AddAddressMutation,
		      variables: {
		        belongsTo: "job",
		        belongsToId: this.props.job.id,
		        type: this.state.addressType,
		        level: this.state.level,
		        line1: this.state.line1,
		        line2: this.state.line2,
		        city: this.state.city,
		        state: this.state.state,
		        zip: this.state.zip,
		        country: this.state.country
		      },
		      optimisticResponse: {
		        belongsTo: "job",
		        belongsToId: this.props.job.id,
		        type: this.state.addressType,
		        level: this.state.level,
		        line1: this.state.line1,
		        line2: this.state.line2,
		        city: this.state.city,
		        state: this.state.state,
		        zip: this.state.zip,
		        country: this.state.country,
		      },
		      update: (proxy, result) => {
		        console.log('PROXY', proxy);

		        console.log('RESULT', result);

		        // Read the data from our cache for this query.
		        const data = proxy.readQuery({ 
		          query: GetJobQuery,
		          variables: {
		            id: this.props.job.id
		          }
		        });
		        console.log('data', data);

		        //combining our original query data with mutation result
		        data.job.address = result.data.addAddressTo;

		        console.log('data after adding address', data);

		        // Write our combined data back to the store cache
		        proxy.writeQuery({ 
		          query: GetJobQuery, 
		          variables: {
		            id: this.props.job.id
		          }, 
		          data 
		        });
		      }
		    });

		    //updating the variable after we change it
		    cachedJobQuery = client.readQuery({
		      query: GetJobQuery,
		      variables: {
		        id: this.props.job.id
		      }
		    });
		  }

		  //UPDATE
		  if(cachedJobQuery.job.address && (this.state.addressType !== cachedJobQuery.job.address.type || this.state.level !== cachedJobQuery.job.address.level || this.state.line1 !== cachedJobQuery.job.address.line1 || this.state.zip !== cachedJobQuery.job.address.zip || this.state.line2 !== cachedJobQuery.job.address.line2 || this.state.city !== cachedJobQuery.job.address.city || this.state.state !== cachedJobQuery.job.address.state)) {
		    client.mutate({
		      mutation: UpdateAddressMutation,
		      variables: {
		        id: cachedJobQuery.job.address ? cachedJobQuery.job.address.id : '',
		        belongsTo: "job",
		        belongsToId: this.props.job.id,
		        type: this.state.addressType,
		        level: this.state.level,
		        line1: this.state.line1,
		        line2: this.state.line2,
		        city: this.state.city,
		        state: this.state.state,
		        zip: this.state.zip,
		        country: this.state.country
		      },
		      optimisticResponse: {
		        id: this.state.addressId,
		        belongsTo: "job",
		        belongsToId: this.props.job.id,
		        type: this.state.addressType,
		        level: this.state.level,
		        line1: this.state.line1,
		        line2: this.state.line2,
		        city: this.state.city,
		        state: this.state.state,
		        zip: this.state.zip,
		        country: this.state.country,
		      },
		      update: (proxy, result) => {
		        console.log('PROXY', proxy);

		        console.log('RESULT', result);

		        // Read the data from our cache for this query.
		        const data = proxy.readQuery({ 
		          query: GetJobQuery,
		          variables: {
		            id: this.props.job.id
		          }
		        });
		        console.log('data', data);

		        //combining our original query data with mutation result
		        data.job.address = result.data.updateAddress;

		        console.log('data after adding address', data);

		        // Write our combined data back to the store cache
		        proxy.writeQuery({ 
		          query: GetJobQuery, 
		          variables: {
		            id: this.props.job.id
		          }, 
		          data 
		        });
		      }
		    });

		    //updating the variable after we change it
		    cachedJobQuery = client.readQuery({
		      query: GetJobQuery,
		      variables: {
		        id: this.props.job.id
		      }
		    });
		  }

		}
		render(){
			return <WrappedComponent />
		}
	}
}