"use client";

import { useState, type ChangeEvent, useEffect } from 'react';
import Image from 'next/image';
import { Camera, ChefHat, Sparkles, UploadCloud, Trash2, PlusCircle, Loader2, AlertCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useToast } from '@/hooks/use-toast';

import { detectIngredients } from '@/ai/flows/detect-ingredients';
import type { DetectIngredientsOutput } from '@/ai/flows/detect-ingredients';
import { suggestRecipes } from '@/ai/flows/suggest-recipes';
import type { SuggestRecipesOutput } from '@/ai/flows/suggest-recipes';

export default function PhotoRecipeClientPage() {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [recipes, setRecipes] = useState<string[]>([]);
  
  const [isLoadingIngredients, setIsLoadingIngredients] = useState(false);
  const [isLoadingRecipes, setIsLoadingRecipes] = useState(false);
  
  const [ingredientError, setIngredientError] = useState<string | null>(null);
  const [recipeError, setRecipeError] = useState<string | null>(null);
  
  const [currentIngredientInput, setCurrentIngredientInput] = useState('');

  const { toast } = useToast();

  const fileToDataUri = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleImageFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreviewUrl(previewUrl);
      
      setIngredients([]);
      setRecipes([]);
      setIngredientError(null);
      setRecipeError(null);
      setIsLoadingIngredients(true);

      try {
        const dataUri = await fileToDataUri(file);
        const result: DetectIngredientsOutput = await detectIngredients({ photoDataUri: dataUri });
        setIngredients(result.ingredients || []);
        if (result.ingredients && result.ingredients.length > 0) {
          toast({ title: "Ingredients Detected!", description: "Review and edit the ingredients below." });
        } else {
          toast({ title: "No Ingredients Detected", description: "Try adding ingredients manually or upload a clearer photo.", variant: "destructive" });
        }
      } catch (error) {
        console.error("Error detecting ingredients:", error);
        setIngredientError("Failed to detect ingredients. Please try again.");
        toast({ title: "Error", description: "Failed to detect ingredients.", variant: "destructive" });
      } finally {
        setIsLoadingIngredients(false);
      }
    }
  };

  const handleAddIngredient = () => {
    if (currentIngredientInput.trim() && !ingredients.includes(currentIngredientInput.trim())) {
      setIngredients([...ingredients, currentIngredientInput.trim()]);
      setCurrentIngredientInput('');
    }
  };

  const handleRemoveIngredient = (ingredientToRemove: string) => {
    setIngredients(ingredients.filter(ing => ing !== ingredientToRemove));
  };

  const handleGetRecipes = async () => {
    if (ingredients.length === 0) {
      toast({ title: "No Ingredients", description: "Please add some ingredients first.", variant: "destructive" });
      return;
    }
    
    setRecipeError(null);
    setIsLoadingRecipes(true);
    try {
      const result: SuggestRecipesOutput = await suggestRecipes({ ingredients });
      setRecipes(result.recipes || []);
      if (result.recipes && result.recipes.length > 0) {
        toast({ title: "Recipes Suggested!", description: "Check out the recipes below." });
      } else {
        toast({ title: "No Recipes Found", description: "Could not find recipes for the given ingredients.", variant: "destructive" });
      }
    } catch (error) {
      console.error("Error suggesting recipes:", error);
      setRecipeError("Failed to suggest recipes. Please try again.");
      toast({ title: "Error", description: "Failed to suggest recipes.", variant: "destructive" });
    } finally {
      setIsLoadingRecipes(false);
    }
  };
  
  // Clean up preview URL
  useEffect(() => {
    return () => {
      if (imagePreviewUrl) {
        URL.revokeObjectURL(imagePreviewUrl);
      }
    };
  }, [imagePreviewUrl]);

  return (
    <div className="container mx-auto p-4 md:p-8">
      <header className="mb-8 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-primary flex items-center justify-center">
          <ChefHat size={48} className="mr-3" />
          PhotoRecipe
        </h1>
        <p className="text-muted-foreground mt-2 text-lg">Turn your food photos into delicious recipes!</p>
      </header>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Left Column: Image Upload & Ingredients */}
        <div className="space-y-8">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center text-2xl">
                <UploadCloud size={28} className="mr-2 text-primary" />
                Upload Food Photo
              </CardTitle>
              <CardDescription>Upload an image of your food to detect ingredients.</CardDescription>
            </CardHeader>
            <CardContent>
              <Input
                id="image-upload"
                type="file"
                accept="image/*"
                onChange={handleImageFileChange}
                className="w-full file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90 cursor-pointer"
                aria-label="Upload food photo"
              />
              {imagePreviewUrl ? (
                <div className="mt-6 relative w-full aspect-video rounded-lg overflow-hidden border-2 border-primary shadow-md">
                  <Image src={imagePreviewUrl} alt="Uploaded food" layout="fill" objectFit="cover" data-ai-hint="food photography"/>
                </div>
              ) : (
                <div className="mt-6 relative w-full aspect-video rounded-lg overflow-hidden border border-dashed border-muted-foreground flex items-center justify-center bg-muted/50">
                   <Image src="https://placehold.co/600x400.png" alt="Placeholder for food" layout="fill" objectFit="cover" data-ai-hint="food plate" />
                   <span className="absolute text-muted-foreground text-center p-4">
                     <Camera size={48} className="mx-auto mb-2" />
                     Your photo will appear here
                   </span>
                </div>
              )}
               {isLoadingIngredients && (
                <div className="mt-4 flex items-center text-primary">
                  <Loader2 size={24} className="animate-spin mr-2" />
                  <span>Detecting ingredients...</span>
                </div>
              )}
              {ingredientError && (
                <Alert variant="destructive" className="mt-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Detection Error</AlertTitle>
                  <AlertDescription>{ingredientError}</AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          {(ingredients.length > 0 || imageFile) && !isLoadingIngredients && (
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center text-2xl">
                  <Sparkles size={28} className="mr-2 text-primary" />
                  Ingredients
                </CardTitle>
                <CardDescription>Review, add, or remove ingredients before generating recipes.</CardDescription>
              </CardHeader>
              <CardContent>
                {ingredients.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {ingredients.map((ing, index) => (
                      <Badge key={index} variant="secondary" className="text-base py-1 px-3 shadow-sm">
                        {ing}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="ml-2 h-auto p-0 text-muted-foreground hover:text-destructive"
                          onClick={() => handleRemoveIngredient(ing)}
                          aria-label={`Remove ${ing}`}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </Badge>
                    ))}
                  </div>
                )}
                {ingredients.length === 0 && !isLoadingIngredients && imageFile && (
                  <p className="text-muted-foreground mb-4">No ingredients detected. Add some manually!</p>
                )}
                <div className="flex items-center gap-2">
                  <Input
                    type="text"
                    placeholder="Add an ingredient"
                    value={currentIngredientInput}
                    onChange={(e) => setCurrentIngredientInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddIngredient()}
                    className="flex-grow"
                    aria-label="Add new ingredient"
                  />
                  <Button onClick={handleAddIngredient} variant="outline" className="text-primary border-primary hover:bg-primary/10">
                    <PlusCircle size={20} className="mr-2" /> Add
                  </Button>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={handleGetRecipes} 
                  disabled={ingredients.length === 0 || isLoadingRecipes}
                  className="w-full text-lg py-6"
                  size="lg"
                >
                  {isLoadingRecipes ? (
                    <Loader2 size={24} className="animate-spin mr-2" />
                  ) : (
                    <Sparkles size={24} className="mr-2" />
                  )}
                  Get Recipes
                </Button>
              </CardFooter>
            </Card>
          )}
        </div>

        {/* Right Column: Recipe Suggestions */}
        <div className="space-y-8">
          <Card className="shadow-lg min-h-[300px]">
            <CardHeader>
              <CardTitle className="flex items-center text-2xl">
                <Sparkles size={28} className="mr-2 text-primary" />
                Recipe Suggestions
              </CardTitle>
              <CardDescription>AI-powered recipe ideas based on your ingredients.</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingRecipes && (
                <div className="flex items-center justify-center text-primary py-10">
                  <Loader2 size={32} className="animate-spin mr-3" />
                  <span>Generating recipes...</span>
                </div>
              )}
              {recipeError && (
                <Alert variant="destructive" className="mt-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Recipe Error</AlertTitle>
                  <AlertDescription>{recipeError}</AlertDescription>
                </Alert>
              )}
              {!isLoadingRecipes && !recipeError && recipes.length > 0 && (
                <Accordion type="single" collapsible className="w-full">
                  {recipes.map((recipe, index) => (
                    <AccordionItem value={`item-${index}`} key={index} className="border-b border-primary/20">
                      <AccordionTrigger className="text-lg hover:no-underline text-left">Recipe Suggestion {index + 1}</AccordionTrigger>
                      <AccordionContent className="pt-2">
                        <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed bg-secondary/50 p-4 rounded-md shadow-inner">{recipe}</pre>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              )}
              {!isLoadingRecipes && !recipeError && recipes.length === 0 && (
                 <div className="text-center text-muted-foreground py-10">
                  {ingredients.length > 0 ? (
                    <p>Click "Get Recipes" to see suggestions.</p>
                  ) : imageFile ? (
                     <p>Add or confirm ingredients, then click "Get Recipes".</p>
                  ) : (
                    <p>Upload an image and detect ingredients to get recipe suggestions.</p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
