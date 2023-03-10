import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Fuse from 'fuse.js';
import FormField from '../../../components/ui/form-field';
import { isEqualCaseInsensitive } from '../../../../shared/modules/string-utils';

export default class TokenSearch extends Component {
  static contextTypes = {
    t: PropTypes.func,
  };

  static defaultProps = {
    error: null,
  };

  static propTypes = {
    onSearch: PropTypes.func,
    error: PropTypes.string,
    tokenList: PropTypes.object,
  };

  state = {
    searchQuery: '',
  };

  constructor(props) {
    super(props);
    const { tokenList } = this.props;
    this.tokenList = Object.values(tokenList);
    this.handleSearch = this.handleSearch.bind(this);
    this.tokenSearchFuse = new Fuse(this.tokenList, {
      shouldSort: true,
      threshold: 0.45,
      location: 0,
      distance: 100,
      maxPatternLength: 32,
      minMatchCharLength: 1,
      keys: [
        { name: 'name', weight: 0.5 },
        { name: 'symbol', weight: 0.5 },
      ],
    });
  }

  handleSearch(searchQuery) {
    this.setState({ searchQuery });
    const fuseSearchResult = this.tokenSearchFuse.search(searchQuery);
    const addressSearchResult = this.tokenList.filter((token) => {
      return (
        token.address &&
        searchQuery &&
        isEqualCaseInsensitive(token.address, searchQuery)
      );
    });
    const results = [...addressSearchResult, ...fuseSearchResult];
    this.props.onSearch({ searchQuery, results });
  }

  render() {
    const { error } = this.props;
    const { searchQuery } = this.state;

    return (
      <FormField
        id="search-tokens"
        placeholder={this.context.t('searchTokens')}
        type="text"
        value={searchQuery}
        onChange={(value) => this.handleSearch(value)}
        error={error}
        autoFocus
        autoComplete="off"
        leadingIcon="search"
      />
    );
  }
}
