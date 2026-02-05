import supabase from "@/utils/supabase";
import type { Category } from "@/types/Category";

const TABLE = "category";

export async function getAllCategories(): Promise<Category[]> {
    const { data, error } = await supabase.from(TABLE).select("*");
    if (error) {
        console.error("Error fetching categories:", error);
        throw error;
    }
    return (data as Category[]) ?? [];
}

export async function getCategoryById(id: number): Promise<Category | null> {
    const { data, error } = await supabase
        .from(TABLE)
        .select("*")
        .eq("id", id)
        .maybeSingle();

    if (error) {
        console.error("Error fetching category by id:", error);
        throw error;
    }

    return (data as Category) ?? null;
}

export async function getCategoriesByName(name: string): Promise<Category[]> {
    const { data, error } = await supabase
        .from(TABLE)
        .select("*")
        .ilike("name", name);

    if (error) {
        console.error("Error fetching categories by name:", error);
        throw error;
    }

    return (data as Category[]) ?? [];
}

export async function updateCategory(
    id: number,
    payload: Partial<Category>,
): Promise<Category> {
    const { data, error } = await supabase
        .from(TABLE)
        .update(payload)
        .eq("id", id)
        .select("*")
        .single();

    if (error) {
        console.error("Error updating category:", error);
        throw error;
    }

    return data as Category;
}

export async function deleteCategory(id: number): Promise<void> {
    const { error } = await supabase.from(TABLE).delete().eq("id", id);
    if (error) {
        console.error("Error deleting category:", error);
        throw error;
    }
}
