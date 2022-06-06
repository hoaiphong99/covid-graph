import dataGraphQLCovid from './data.js';
import {gql} from 'apollo-server';

export const typeDefs = gql`
  type Query {
    countryStats(filter: CountryFilter): [CountryStats!]!
  }

  type CountryStats {
    country: String
    cases: Int
    todayCases: Int
    deaths: Int
    todayDeaths: Int
    recovered: Int
    active: Int
    critical: Int
    casesPerOneMillion: Int
    deathsPerOneMillion: Int
    countryCode: String
    confirmed: Int
  }

  input CountryFilter {
    country: String
  }
`;

const filterHandlers = {
  country: country => data => {
    return data.filter(item => item.country === country);
  }
};

const filterWith = filters => data => {
  return Object.entries(filterHandlers).reduce(
    (filteredData, [name, handler]) => {
      return name in filters
        ? handler(filters[name])(filteredData)
        : filteredData;
    },
    data
  );
};

export const resolvers = {
  Query: {
    countryStats: async (_, args) => {
      const json = dataGraphQLCovid;
      const {data} = json;
      const {filter} = args;

      return filter ? filterWith(filter)(data) : data;
    }
  }
};
