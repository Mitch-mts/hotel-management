package mts.mtech.persistence;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.repository.NoRepositoryBean;
import org.springframework.data.repository.PagingAndSortingRepository;

@NoRepositoryBean
public interface BaseRepository<T> extends JpaRepository<T, Long>, PagingAndSortingRepository<T, Long>, JpaSpecificationExecutor<T> {
}
