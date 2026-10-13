package com.cinemate.auth;

import com.cinemate.exceptions.ForbiddenActionException;
import com.cinemate.user.Role;
import com.cinemate.user.User;
import java.util.Optional;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

/** Authorization checks based on the user that JwtAuthFilter put into the security context. */
@Component
public class AccessGuard {

  /**
   * returns the authenticated user of the current request, if any
   *
   * @return Optional<User>
   */
  public Optional<User> currentUser() {
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    if (authentication != null && authentication.getPrincipal() instanceof User user) {
      return Optional.of(user);
    }
    return Optional.empty();
  }

  /**
   * checks whether the current request comes from an admin
   *
   * @return boolean
   */
  public boolean isAdmin() {
    return currentUser().map(user -> user.getRole() == Role.ADMIN).orElse(false);
  }

  /**
   * throws unless the current user is an admin
   *
   * @throws ForbiddenActionException
   */
  public void requireAdmin() {
    if (!isAdmin()) {
      throw new ForbiddenActionException("Admin rights required");
    }
  }

  /**
   * throws unless the current user is the given user or an admin
   *
   * @param userId
   * @throws ForbiddenActionException
   */
  public void requireSelfOrAdmin(String userId) {
    boolean isSelf = currentUser().map(user -> user.getId().equals(userId)).orElse(false);
    if (!isSelf && !isAdmin()) {
      throw new ForbiddenActionException("You can only change your own account");
    }
  }
}
