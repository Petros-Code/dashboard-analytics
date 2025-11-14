"""
Application constants
"""
from enum import Enum


class OperationalCostCategory(str, Enum):
    """Operational cost categories"""
    CONDITIONNEMENT = "conditionnement"
    LAVAGE = "lavage"
    DEBOULOCHAGE = "deboulochage"
    DIVERS = "divers"
    AUTRES = "autres"
    ABONNEMENT = "abonnement"
    
    @classmethod
    def get_all_values(cls) -> list[str]:
        """Get all category values as a list"""
        return [category.value for category in cls]
    
    @classmethod
    def get_display_names(cls) -> dict[str, str]:
        """Get category display names in French"""
        return {
            cls.CONDITIONNEMENT.value: "Conditionnement",
            cls.LAVAGE.value: "Lavage",
            cls.DEBOULOCHAGE.value: "Déboulochage",
            cls.DIVERS.value: "Divers",
            cls.AUTRES.value: "Autres",
            cls.ABONNEMENT.value: "Abonnement"
        }

