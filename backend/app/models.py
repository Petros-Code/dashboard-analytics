from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Boolean
from sqlalchemy.orm import declarative_base
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

# Création bdd Postgresql
Base = declarative_base()

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(50), nullable=False)
    email = Column(String(100), nullable=False, unique=True)
    hashed_password = Column(String(255), nullable=False)
    created_at = Column(DateTime, default=func.now())

    user_roles = relationship("UserRole", back_populates="user")

class Role(Base):
    __tablename__ = "roles"

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(50), nullable=False)
    description = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=func.now())

    user_roles = relationship("UserRole", back_populates="role")

class UserRole(Base):
    __tablename__ = "users_roles"

    user_id = Column(Integer, ForeignKey("users.id"), primary_key=True)
    role_id = Column(Integer, ForeignKey("roles.id"), primary_key=True)
    assigned_at = Column(DateTime, default=func.now())

    user = relationship("User", back_populates="user_roles")
    role = relationship("Role", back_populates="user_roles")
