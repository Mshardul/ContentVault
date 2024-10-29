import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import TagsList from '../components/TagsList';
import PageTitle from '../components/PageTitle';

const TagListPage = () => {
  const { tags } = useContext(AppContext); // List of all tags with counts

  const sortedTags = [...tags].sort((a, b) => b.count - a.count);

  return (
    <div className="container mx-auto">
      <PageTitle title="All Tags" />
      <TagsList size={"md"} selectedTags={sortedTags} />
    </div>
  );
};

export default TagListPage;
