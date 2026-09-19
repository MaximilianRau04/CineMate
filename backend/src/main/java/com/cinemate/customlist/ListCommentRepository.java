package com.cinemate.customlist;

import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ListCommentRepository extends MongoRepository<ListComment, String> {

  List<ListComment> findByCustomListOrderByCreatedAtDesc(CustomList customList);

  Page<ListComment> findByCustomListOrderByCreatedAtDesc(CustomList customList, Pageable pageable);

  long countByCustomList(CustomList customList);

  List<ListComment> findByAuthorOrderByCreatedAtDesc(com.cinemate.user.User author);
}
